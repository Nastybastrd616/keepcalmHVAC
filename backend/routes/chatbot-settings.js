// Chatbot settings management route
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const CHATBOT_SETTINGS_PATH = path.join(__dirname, '../data/chatbot_settings.json');

// GET /api/chatbot-settings
router.get('/', async (req, res) => {
  try {
    let settings;
    try {
      const data = await fs.readFile(CHATBOT_SETTINGS_PATH, 'utf-8');
      settings = JSON.parse(data);
    } catch (error) {
      // Default settings if file doesn't exist
      settings = {
        enabled: false,
        endpoint: 'http://localhost:1234/v1',
        apiKey: '',
        model: 'default',
        systemPrompt: 'You are an HVAC assistant. Answer user questions about HVAC services, scheduling, pricing, and emergencies.'
      };
      // Create the file with default settings
      await fs.writeFile(CHATBOT_SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
    }
    res.json(settings);
  } catch (error) {
    console.error('Error retrieving chatbot settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chatbot settings: ' + error.message
    });
  }
});

// POST /api/chatbot-settings
router.post('/', async (req, res) => {
  try {
    const settings = req.body;
    await fs.writeFile(CHATBOT_SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
    res.json({ 
      success: true, 
      message: 'Chatbot settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating chatbot settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update chatbot settings: ' + error.message
    });
  }
});

// POST /api/chatbot-settings/test
router.post('/test', async (req, res) => {
  try {
    const { endpoint, apiKey } = req.body;
    
    // Attempt to connect to the specified endpoint
    const fetch = require('node-fetch');
    const response = await fetch(`${endpoint}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey ? `Bearer ${apiKey}` : ''
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an HVAC assistant.' },
          { role: 'user', content: 'Test connection' }
        ],
        max_tokens: 5
      }),
      timeout: 5000 // 5 second timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        res.json({
          success: true,
          message: 'Connected successfully!'
        });
      } else {
        throw new Error('Invalid response format from AI service');
      }
    } else {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('Error testing chatbot connection:', error);
    res.status(500).json({
      success: false,
      message: `Connection test failed: ${error.message}`
    });
  }
});

module.exports = router;
