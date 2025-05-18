const express = require('express');
const router = express.Router();
const { getChatbotHistory, addChatbotMessage } = require('../services/chatbot-history');

// GET /api/chatbot-history
router.get('/', (req, res) => {
  res.json(getChatbotHistory());
});

// POST /api/chatbot-history
router.post('/', (req, res) => {
  const updated = addChatbotMessage(req.body);
  res.json(updated);
});

module.exports = router;
