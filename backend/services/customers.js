const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox,
  applicationId: process.env.SQUARE_APPLICATION_ID
});

const customersApi = squareClient.customersApi;

/**
 * Fetches all customers from Square
 * @param {Object} options - Options for pagination
 * @returns {Promise<Array>} Array of customers
 */
async function listCustomers(options = {}) {
  try {
    const { cursor = null, limit = 100 } = options;
    
    const response = await customersApi.listCustomers(cursor, limit);
    return response.result;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

/**
 * Get a single customer by ID
 * @param {string} customerId - The customer ID
 * @returns {Promise<Object>} The customer
 */
async function getCustomer(customerId) {
  try {
    const response = await customersApi.retrieveCustomer(customerId);
    return response.result;
  } catch (error) {
    console.error(`Error fetching customer ${customerId}:`, error);
    throw error;
  }
}

/**
 * Create a new customer
 * @param {Object} customerData - The data for the new customer
 * @returns {Promise<Object>} The created customer
 */
async function createCustomer(customerData) {
  try {
    // Generate a unique client-side ID
    const idempotencyKey = randomUUID();
    
    const response = await customersApi.createCustomer({
      idempotencyKey,
      givenName: customerData.firstName || '',
      familyName: customerData.lastName || '',
      emailAddress: customerData.email || '',
      phoneNumber: customerData.phone || '',
      address: customerData.address ? {
        addressLine1: customerData.address.line1 || '',
        addressLine2: customerData.address.line2 || '',
        locality: customerData.address.city || '',
        administrativeDistrictLevel1: customerData.address.state || '',
        postalCode: customerData.address.postalCode || '',
        country: customerData.address.country || 'US'
      } : undefined
    });
    
    return response.result;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Update a customer
 * @param {string} customerId - The ID of the customer to update
 * @param {Object} customerData - The updated customer data
 * @returns {Promise<Object>} The updated customer
 */
async function updateCustomer(customerId, customerData) {
  try {
    const response = await customersApi.updateCustomer(customerId, {
      givenName: customerData.firstName,
      familyName: customerData.lastName,
      emailAddress: customerData.email,
      phoneNumber: customerData.phone,
      address: customerData.address ? {
        addressLine1: customerData.address.line1 || '',
        addressLine2: customerData.address.line2 || '',
        locality: customerData.address.city || '',
        administrativeDistrictLevel1: customerData.address.state || '',
        postalCode: customerData.address.postalCode || '',
        country: customerData.address.country || 'US'
      } : undefined
    });
    
    return response.result;
  } catch (error) {
    console.error(`Error updating customer ${customerId}:`, error);
    throw error;
  }
}

/**
 * Delete a customer
 * @param {string} customerId - The ID of the customer to delete
 * @returns {Promise<Object>} The delete response
 */
async function deleteCustomer(customerId) {
  try {
    const response = await customersApi.deleteCustomer(customerId);
    return response.result;
  } catch (error) {
    console.error(`Error deleting customer ${customerId}:`, error);
    throw error;
  }
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
