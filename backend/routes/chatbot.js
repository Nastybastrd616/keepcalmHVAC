const express = require('express');
const router = express.Router();
const { processIntent, getAIReply } = require('../services/chatbot');

// POST /api/chat-intent - Process chatbot intents
router.post('/intent', async (req, res, next) => {
  try {
    const intent = req.body;
    const result = await processIntent(intent);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/chatbot - AI chat endpoint
router.post('/', async (req, res) => {
  try {
    // Check if this is a settings save request
    if (req.body.action === 'saveSettings' && req.body.settings) {
      const fs = require('fs').promises;
      const path = require('path');
      const CHATBOT_SETTINGS_PATH = path.join(__dirname, '../data/chatbot_settings.json');
      
      // Save the settings to the file
      await fs.writeFile(CHATBOT_SETTINGS_PATH, JSON.stringify(req.body.settings, null, 2), 'utf-8');
      return res.json({
        success: true,
        message: 'Chatbot settings saved successfully'
      });
    }
    
    // Handle regular chat messages
    const { message } = req.body;
    const aiReply = await getAIReply(message);
    res.json({ message: aiReply });
  } catch (e) {
    res.status(500).json({ message: 'AI error: ' + e.message });
  }
});

module.exports = router;
