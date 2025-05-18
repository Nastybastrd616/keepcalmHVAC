const express = require('express');
const router = express.Router();
const { getSystemLogs, addSystemLog } = require('../services/system-logs');

// GET /api/system-logs
router.get('/', (req, res) => {
  res.json(getSystemLogs());
});

// POST /api/system-logs
router.post('/', (req, res) => {
  const updated = addSystemLog(req.body);
  res.json(updated);
});

module.exports = router;
