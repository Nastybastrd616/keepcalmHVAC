/**
 * Service for handling chatbot intents and converting them to API actions
 */

/**
 * Process a chatbot intent and route it to the appropriate service
 * @param {Object} intent - The chatbot intent object
 * @returns {Promise<Object>} The result of the action
 */
async function processIntent(intent) {
  try {
    // Extract action and parameters from intent
    const { action, ...params } = intent;
    
    // Map actions to handler functions
    const handlers = {
      'create_invoice': createInvoiceFromIntent,
      'create_estimate': createEstimateFromIntent,
      'schedule_appointment': scheduleAppointmentFromIntent,
      'get_customer': getCustomerFromIntent,
    };
    
    // Check if handler exists for this action
    if (!handlers[action]) {
      throw new Error(`Unknown action: ${action}`);
    }
    
    // Execute the appropriate handler and return result
    return await handlers[action](params);
  } catch (error) {
    console.error('Error processing chatbot intent:', error);
    throw error;
  }
}

// Intent handlers - In a real implementation, these would call your service functions

async function createInvoiceFromIntent({ customer, amount, due_date, description }) {
  // Validate required parameters
  if (!customer) throw new Error('Customer name is required');
  if (!amount) throw new Error('Amount is required');
  
  // In a real implementation, you would:
  // 1. Look up the customer ID from the name
  // 2. Call the invoice service to create the invoice
  // 3. Return the result
  
  return {
    success: true,
    message: `Created invoice for ${customer} for $${amount}`,
    intent: {
      action: 'create_invoice',
      customer,
      amount: parseFloat(amount),
      due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: description || 'Invoice created via chatbot'
    }
  };
}

async function createEstimateFromIntent({ customer, amount, description }) {
  // Validate required parameters
  if (!customer) throw new Error('Customer name is required');
  
  // In a real implementation, you would:
  // 1. Look up the customer ID from the name
  // 2. Call the estimate service to create the estimate
  // 3. Return the result
  
  return {
    success: true,
    message: `Created estimate for ${customer}${amount ? ' for $' + amount : ''}`,
    intent: {
      action: 'create_estimate',
      customer,
      amount: amount ? parseFloat(amount) : null,
      description: description || 'Estimate created via chatbot'
    }
  };
}

async function scheduleAppointmentFromIntent({ customer, date, time, description }) {
  // Validate required parameters
  if (!customer) throw new Error('Customer name is required');
  if (!date) throw new Error('Date is required');
  
  // In a real implementation, you would:
  // 1. Look up the customer ID from the name
  // 2. Call the schedule service to create the appointment
  // 3. Return the result
  
  return {
    success: true,
    message: `Scheduled appointment for ${customer} on ${date} ${time || 'TBD'}`,
    intent: {
      action: 'schedule_appointment',
      customer,
      date,
      time: time || '10:00 AM',
      description: description || 'Appointment created via chatbot'
    }
  };
}

async function getCustomerFromIntent({ customer }) {
  // Validate required parameters
  if (!customer) throw new Error('Customer name is required');
  
  // In a real implementation, you would:
  // 1. Look up the customer by name
  // 2. Return the customer details
  
  return {
    success: true,
    message: `Found customer: ${customer}`,
    intent: {
      action: 'get_customer',
      customer
    },
    data: {
      name: customer,
      email: `${customer.toLowerCase().replace(/\s/g, '.')}@example.com`,
      phone: '555-123-4567'
    }
  };
}

module.exports = {
  processIntent
};
