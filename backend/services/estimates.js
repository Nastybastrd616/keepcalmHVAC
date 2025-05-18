const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox
});

// Since Square doesn't have a dedicated "estimates" API, we'll use 
// custom objects in the catalog to store estimates
const catalogApi = squareClient.catalogApi;

/**
 * Fetches all estimates (represented as custom objects in catalog)
 * @param {Object} options - Options for pagination
 * @returns {Promise<Array>} Array of estimates
 */
async function listEstimates(options = {}) {
  try {
    const { cursor } = options;
    // Build body and only include cursor if it is a string
    const body = {
      objectTypes: ["CUSTOM_ATTRIBUTE_DEFINITION"],
      query: {
        exactQuery: {
          attributeName: "type",
          attributeValue: "estimate"
        }
      }
    };
    if (typeof cursor === 'string') body.cursor = cursor;
    const response = await catalogApi.searchCatalogObjects(body);
    return response.result;
  } catch (error) {
    console.error('Error fetching estimates:', error);
    throw error;
  }
}

/**
 * Get a single estimate by ID
 * @param {string} estimateId - The estimate ID
 * @returns {Promise<Object>} The estimate
 */
async function getEstimate(estimateId) {
  try {
    const response = await catalogApi.retrieveCatalogObject(estimateId);
    return response.result;
  } catch (error) {
    console.error(`Error fetching estimate ${estimateId}:`, error);
    throw error;
  }
}

/**
 * Create a new estimate
 * @param {Object} estimateData - The data for the new estimate
 * @returns {Promise<Object>} The created estimate
 */
async function createEstimate(estimateData) {
  try {
    // Generate a unique client-side ID
    const idempotencyKey = randomUUID();
    
    const customObject = {
      type: "CUSTOM_ATTRIBUTE_DEFINITION",
      id: `#${idempotencyKey}`,
      customAttributeDefinitionData: {
        type: "STRING",
        name: `estimate_${idempotencyKey}`,
        description: "Estimate created through API",
        sourceApplication: {
          applicationId: "custom_estimate_app"
        },
        allowedObjectTypes: ["ITEM"],
        sellerVisibility: "SELLER_VISIBILITY_READ_WRITE_VALUES",
        appVisibility: "APP_VISIBILITY_READ_WRITE_VALUES",
        stringConfig: {
          enforceUniqueness: false
        }
      },
      // Store estimate data in a custom attribute
      customAttributes: {
        type: { name: "type", stringValue: "estimate" },
        customer_id: { name: "customer_id", stringValue: estimateData.customerId || "" },
        title: { name: "title", stringValue: estimateData.title || "Estimate" },
        description: { name: "description", stringValue: estimateData.description || "" },
        amount: { name: "amount", stringValue: estimateData.amount ? estimateData.amount.toString() : "0" },
        currency: { name: "currency", stringValue: "USD" },
        due_date: { name: "due_date", stringValue: estimateData.dueDate || "" },
        status: { name: "status", stringValue: estimateData.status || "DRAFT" },
        created_at: { name: "created_at", stringValue: new Date().toISOString() }
      }
    };
    
    const response = await catalogApi.upsertCatalogObject({
      idempotencyKey,
      object: customObject
    });
    
    return response.result;
  } catch (error) {
    console.error('Error creating estimate:', error);
    throw error;
  }
}

/**
 * Update an estimate
 * @param {string} estimateId - The ID of the estimate to update
 * @param {Object} estimateData - The updated estimate data
 * @returns {Promise<Object>} The updated estimate
 */
async function updateEstimate(estimateId, estimateData) {
  try {
    // First retrieve the current item to get the version
    const currentEstimate = await getEstimate(estimateId);
    const version = currentEstimate.object.version;
    
    // Generate a unique client-side ID
    const idempotencyKey = randomUUID();
    
    // Create object clone with updated data
    const customObject = {
      ...currentEstimate.object,
      version,
      // Update specific fields in custom attributes
      customAttributes: {
        ...currentEstimate.object.customAttributes,
        ...(estimateData.customerId && { customer_id: { name: "customer_id", stringValue: estimateData.customerId } }),
        ...(estimateData.title && { title: { name: "title", stringValue: estimateData.title } }),
        ...(estimateData.description && { description: { name: "description", stringValue: estimateData.description } }),
        ...(estimateData.amount && { amount: { name: "amount", stringValue: estimateData.amount.toString() } }),
        ...(estimateData.dueDate && { due_date: { name: "due_date", stringValue: estimateData.dueDate } }),
        ...(estimateData.status && { status: { name: "status", stringValue: estimateData.status } }),
        updated_at: { name: "updated_at", stringValue: new Date().toISOString() }
      }
    };
    
    const response = await catalogApi.upsertCatalogObject({
      idempotencyKey,
      object: customObject
    });
    
    return response.result;
  } catch (error) {
    console.error(`Error updating estimate ${estimateId}:`, error);
    throw error;
  }
}

/**
 * Delete an estimate
 * @param {string} estimateId - The ID of the estimate to delete
 * @returns {Promise<Object>} The delete response
 */
async function deleteEstimate(estimateId) {
  try {
    const response = await catalogApi.deleteCatalogObject(estimateId);
    return response.result;
  } catch (error) {
    console.error(`Error deleting estimate ${estimateId}:`, error);
    throw error;
  }
}

/**
 * Convert an estimate to an invoice
 * @param {string} estimateId - The ID of the estimate to convert
 * @returns {Promise<Object>} The created invoice
 */
async function convertEstimateToInvoice(estimateId) {
  try {
    // Get the estimate data
    const estimateResult = await getEstimate(estimateId);
    const estimate = estimateResult.object;
    
    // Extract estimate data
    const customerId = estimate.customAttributes.customer_id.stringValue;
    const amount = parseFloat(estimate.customAttributes.amount.stringValue);
    const title = estimate.customAttributes.title.stringValue;
    const description = estimate.customAttributes.description.stringValue;
    
    // Create invoice service - would need to import
    // For now, just return the data that would be used
    return {
      action: "convert_to_invoice",
      data: {
        customerId,
        title,
        description,
        amount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      }
    };
    
    // In a real implementation, you would:
    // 1. Call the invoice service to create an invoice
    // 2. Update the estimate status to "CONVERTED"
    // 3. Return both the invoice and updated estimate
  } catch (error) {
    console.error(`Error converting estimate ${estimateId} to invoice:`, error);
    throw error;
  }
}

module.exports = {
  listEstimates,
  getEstimate,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  convertEstimateToInvoice
};
