const { Client, Environment } = require('square');
const { randomUUID } = require('crypto');

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: process.env.NODE_ENV === 'production' 
    ? Environment.Production 
    : Environment.Sandbox
});

const invoicesApi = squareClient.invoicesApi;

/**
 * Fetches all invoices from Square
 * @param {Object} options - Options for pagination and filtering
 * @returns {Promise<Array>} Array of invoices
 */
async function listInvoices(options = {}) {
  try {
    let { cursor, limit = 100, locationId } = options;
    // Use env variable as fallback
    if (!locationId) {
      locationId = process.env.SQUARE_LOCATION_ID;
    }
    if (!locationId) {
      throw new Error('Location ID is required to list invoices');
    }
    // Only pass cursor if it is a string
    const response = await invoicesApi.listInvoices(
      locationId,
      typeof cursor === 'string' ? cursor : undefined,
      limit
    );
    // Add computed amount field to each invoice
    if (response.result && response.result.invoices) {
      response.result.invoices = response.result.invoices.map(inv => {
        let amount = 0;
        if (
          inv.paymentRequests &&
          inv.paymentRequests.length > 0
        ) {
          const pr = inv.paymentRequests[0];
          if (pr.lineItems) {
            amount = pr.lineItems.reduce((sum, item) => {
              return sum + ((item.basePriceMoney && item.basePriceMoney.amount) ? item.basePriceMoney.amount : 0) * (parseInt(item.quantity) || 1);
            }, 0) / 100;
          } else if (pr.computedAmountMoney && pr.computedAmountMoney.amount) {
            console.log('Invoice', inv.id, 'computedAmountMoney.amount:', pr.computedAmountMoney.amount);
            amount = parseInt(pr.computedAmountMoney.amount) / 100;
            console.log('Invoice', inv.id, 'calculated amount:', amount);
          }
        }
        return { ...inv, amount };
      });
    }
    return response.result;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

/**
 * Get a single invoice by ID
 * @param {string} invoiceId - The invoice ID
 * @returns {Promise<Object>} The invoice
 */
async function getInvoice(invoiceId) {
  try {
    const response = await invoicesApi.getInvoice(invoiceId);
    return response.result;
  } catch (error) {
    console.error(`Error fetching invoice ${invoiceId}:`, error);
    throw error;
  }
}

/**
 * Create a new invoice
 * @param {Object} invoiceData - The data for the new invoice
 * @returns {Promise<Object>} The created invoice
 */
async function createInvoice(invoiceData) {
  try {
    // Generate a unique client-side ID
    const idempotencyKey = randomUUID();
    
    const invoice = {
      primaryRecipient: {
        customerId: invoiceData.customerId
      },
      paymentRequests: [
        {
          requestType: 'BALANCE',
          dueDate: invoiceData.dueDate,
          tippingEnabled: false,
          automaticPaymentSource: 'NONE',
          reminders: [
            {
              relativeScheduledDays: -1,
              message: 'Your invoice is due tomorrow'
            }
          ],
        }
      ],
      deliveryMethod: 'EMAIL',
      title: invoiceData.title || 'Invoice',
      description: invoiceData.description || '',
      scheduledAt: invoiceData.scheduledAt || new Date().toISOString(),
      locationId: invoiceData.locationId,
    };
    
    // Add line items if provided
    if (invoiceData.lineItems && invoiceData.lineItems.length) {
      invoice.paymentRequests[0].lineItems = invoiceData.lineItems.map(item => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity || '1',
        basePriceMoney: {
          amount: item.amount ? parseInt(item.amount * 100) : 0,
          currency: 'USD'
        }
      }));
    }
    
    const response = await invoicesApi.createInvoice({
      idempotencyKey,
      invoice
    });
    
    return response.result;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Update an invoice
 * @param {string} invoiceId - The ID of the invoice to update
 * @param {Object} invoiceData - The updated invoice data
 * @returns {Promise<Object>} The updated invoice
 */
async function updateInvoice(invoiceId, invoiceData) {
  try {
    const { version } = invoiceData;
    
    if (!version) {
      // Need to get current version
      const current = await getInvoice(invoiceId);
      version = current.invoice.version;
    }
    
    const invoice = {
      id: invoiceId,
      version: version,
      primaryRecipient: {
        customerId: invoiceData.customerId
      },
      title: invoiceData.title,
      description: invoiceData.description,
      scheduledAt: invoiceData.scheduledAt
    };
    
    // Only include fields that are being updated
    const fieldsToUpdate = [];
    if (invoiceData.customerId) fieldsToUpdate.push('PRIMARY_RECIPIENT');
    if (invoiceData.title) fieldsToUpdate.push('TITLE');
    if (invoiceData.description) fieldsToUpdate.push('DESCRIPTION');
    if (invoiceData.scheduledAt) fieldsToUpdate.push('SCHEDULED_AT');
    
    const response = await invoicesApi.updateInvoice(invoiceId, {
      invoice,
      idempotencyKey: randomUUID(),
      fieldsToClear: [],
      fields: fieldsToUpdate
    });
    
    return response.result;
  } catch (error) {
    console.error(`Error updating invoice ${invoiceId}:`, error);
    throw error;
  }
}

/**
 * Delete an invoice
 * @param {string} invoiceId - The ID of the invoice to delete
 * @param {number} version - The current version of the invoice
 * @returns {Promise<Object>} The delete response
 */
async function deleteInvoice(invoiceId, version) {
  try {
    if (!version) {
      // Need to get current version
      const current = await getInvoice(invoiceId);
      version = current.invoice.version;
    }
    
    const response = await invoicesApi.deleteInvoice(invoiceId, version);
    return response.result;
  } catch (error) {
    console.error(`Error deleting invoice ${invoiceId}:`, error);
    throw error;
  }
}

module.exports = {
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice
};
