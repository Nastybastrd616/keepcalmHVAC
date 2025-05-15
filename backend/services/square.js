const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

// Function to initialize Square client with potentially refreshed credentials
const getSquareClient = () => {
  // Default to sandbox environment if not specified
  const environment = process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox;
    
  // Set default request timeout to 10 seconds (10000ms)
  const timeout = parseInt(process.env.SQUARE_API_TIMEOUT || '10000');
  
  // Initialize with required parameters and timeout settings
  return new Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN,
    environment: environment,
    applicationId: process.env.SQUARE_APPLICATION_ID,
    timeout: timeout,
    retryConfig: {
      maxNumberOfRetries: 3,
      retryOnTimeout: true
    }
  });
};

// Initialize Square client
const squareClient = getSquareClient();

const catalogApi = squareClient.catalogApi;

/**
 * Fetches all catalog items from Square
 * @param {Object} options - Options for pagination
 * @returns {Promise<Array>} Array of catalog items
 */
async function listCatalogItems(options = {}) {
  try {
    const { cursor, types = ['ITEM'] } = options;
    
    const response = await catalogApi.listCatalog(cursor, types);
    return response.result;
  } catch (error) {
    console.error('Error fetching catalog items:', error);
    throw error;
  }
}

/**
 * Get a single catalog item by ID
 * @param {string} itemId - The catalog item ID
 * @returns {Promise<Object>} The catalog item
 */
async function getCatalogItem(itemId) {
  try {
    const response = await catalogApi.retrieveCatalogObject(itemId);
    return response.result;
  } catch (error) {
    console.error(`Error fetching catalog item ${itemId}:`, error);
    throw error;
  }
}

/**
 * Create a new catalog item
 * @param {Object} itemData - The data for the new item
 * @returns {Promise<Object>} The created catalog item
 */
async function createCatalogItem(itemData) {
  try {
    // Generate a unique client-side ID
    const idempotencyKey = randomUUID();
    
    // Build the catalog object
    const catalogObject = {
      type: 'ITEM',
      id: `#${idempotencyKey}`,
      itemData: {
        name: itemData.name,
        description: itemData.description || '',
        variations: [
          {
            type: 'ITEM_VARIATION',
            id: `#${idempotencyKey}_variation`,
            itemVariationData: {
              name: 'Regular',
              pricingType: 'FIXED_PRICING',
              priceMoney: {
                amount: itemData.price ? parseInt(itemData.price * 100) : 0,
                currency: 'USD'
              }
            }
          }
        ]
      }
    };
    
    const response = await catalogApi.upsertCatalogObject({
      idempotencyKey,
      object: catalogObject
    });
    
    return response.result;
  } catch (error) {
    console.error('Error creating catalog item:', error);
    throw error;
  }
}

/**
 * Update a catalog item
 * @param {string} itemId - The ID of the item to update
 * @param {Object} itemData - The updated item data
 * @returns {Promise<Object>} The updated catalog item
 */
async function updateCatalogItem(itemId, itemData) {
  try {
    // First retrieve the current item to get the version
    const currentItem = await getCatalogItem(itemId);
    const version = currentItem.object.version;
    
    // Generate a unique client-side ID
    const idempotencyKey = randomUUID();
    
    // Create the updated object
    const catalogObject = {
      type: 'ITEM',
      id: itemId,
      version: version,
      itemData: {
        name: itemData.name,
        description: itemData.description || '',
        // Keep existing variations, but update if provided
        // In a real implementation, you'd need more complex logic to handle variations
      }
    };
    
    const response = await catalogApi.upsertCatalogObject({
      idempotencyKey,
      object: catalogObject
    });
    
    return response.result;
  } catch (error) {
    console.error(`Error updating catalog item ${itemId}:`, error);
    throw error;
  }
}

/**
 * Delete a catalog item
 * @param {string} itemId - The ID of the item to delete
 * @returns {Promise<Object>} The delete response
 */
async function deleteCatalogItem(itemId) {
  try {
    const response = await catalogApi.deleteCatalogObject(itemId);
    return response.result;
  } catch (error) {
    console.error(`Error deleting catalog item ${itemId}:`, error);
    throw error;
  }
}

/**
 * Tests the connection to the Square API
 * @returns {Promise<Object>} Square API response
 */
async function testConnection() {
  try {
    // First, validate that we have the required credentials
    if (!process.env.SQUARE_ACCESS_TOKEN) {
      return {
        success: false,
        message: 'Connection test failed: Missing Square access token in .env file',
        error: { details: 'Please update SQUARE_ACCESS_TOKEN in your .env file with a valid token' }
      };
    }
    
    // Check if the token looks like a placeholder/dummy value
    if (process.env.SQUARE_ACCESS_TOKEN.includes('dummy') || 
        process.env.SQUARE_ACCESS_TOKEN === 'YOUR_SQUARE_ACCESS_TOKEN') {
      return {
        success: false,
        message: 'Connection test failed: Using placeholder access token in .env file',
        error: { details: 'Please update SQUARE_ACCESS_TOKEN in your .env file with your actual token from Square Developer Dashboard' }
      };
    }

    console.log('Testing Square API connection with:');
    console.log('- Environment:', process.env.NODE_ENV);
    console.log('- Application ID:', process.env.SQUARE_APPLICATION_ID);
    console.log('- Access Token (first 4 chars):', process.env.SQUARE_ACCESS_TOKEN.substring(0, 4) + '...');
    
    // Test by retrieving locations which requires valid credentials
    const locationsApi = squareClient.locationsApi;
    
    try {
      const response = await locationsApi.listLocations();
      return {
        success: true,
        message: 'Square API connection successful',
        data: response.result
      };
    } catch (apiError) {
      // Handle specific API errors
      console.error('API Error testing Square connection:', apiError);
      
      // Check for common auth errors
      if (apiError.statusCode === 401) {
        return {
          success: false,
          message: 'Authentication failed: Invalid access token',
          error: { 
            details: 'Your Square access token is invalid. Please check that you are using a valid token from the Square Developer Dashboard.',
            statusCode: apiError.statusCode
          }
        };
      }
      
      return {
        success: false,
        message: `Connection test failed: ${apiError.message || 'API Error'}`,
        error: apiError
      };
    }
  } catch (error) {
    // Handle network or other errors
    console.error('Network or system error testing Square connection:', error);
    return {
      success: false,
      message: `Failed to connect: ${error.code || 'Network Error'}`,
      error: {
        code: error.code,
        message: error.message,
        stack: error.stack
      }
    };
  }
}

module.exports = {
  listCatalogItems,
  getCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  testConnection
};
