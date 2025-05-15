const express = require('express');
const router = express.Router();
const { processIntent } = require('../services/chatbot');

// POST /api/chat-intent - Process chatbot intents
router.post('/', async (req, res, next) => {
  try {
    const intent = req.body;
    const result = await processIntent(intent);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
