/**
 * Service for handling chatbot intents and converting them to API actions
 */

const fetch = require('node-fetch');

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

/**
 * Get a response from a local OpenAI-compatible endpoint (e.g., LM Studio)
 * @param {string} prompt
 * @returns {Promise<string>} The AI's reply
 */
async function getAIReply(prompt) {
  try {
    // Read settings from file
    const fs = require('fs').promises;
    const path = require('path');
    const CHATBOT_SETTINGS_PATH = path.join(__dirname, '../data/chatbot_settings.json');
    
    let settings;
    try {
      const data = await fs.readFile(CHATBOT_SETTINGS_PATH, 'utf-8');
      settings = JSON.parse(data);
    } catch (error) {
      console.error('Error reading chatbot settings:', error.message);
      settings = {
        enabled: false,
        endpoint: 'http://localhost:1234/v1',
        apiKey: '',
        model: 'gpt-3.5-turbo',
        systemPrompt: 'You are an HVAC assistant. Answer user questions about HVAC services, scheduling, pricing, and emergencies.'
      };
    }
    
    // If chatbot is disabled, return a default message
    if (!settings.enabled) {
      return 'The chatbot service is currently disabled. Please check your settings and try again later.';
    }
    
    const res = await fetch(`${settings.endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': settings.apiKey ? `Bearer ${settings.apiKey}` : ''
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: settings.systemPrompt || 'You are an HVAC assistant. Answer user questions about HVAC services, scheduling, pricing, and emergencies.' },
          { role: 'user', content: prompt }
        ]
      }),
      timeout: 10000 // 10 second timeout
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`AI API error (${res.status}):`, errorText);
      return `Sorry, there was a problem with the AI service (Error ${res.status}). Please try again later.`;
    }
    
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I could not get a response.';
  } catch (e) {
    console.error('AI backend error:', e);
    return 'Sorry, there was a problem connecting to the AI assistant. Please check that your AI service is running and accessible.';
  }
}

// Export getAIReply for use in chatbot route
module.exports = {
  processIntent,
  getAIReply
};
