const express = require('express');
const router = express.Router();
const { getSystemMetadata, updateSystemMetadata } = require('../services/system-metadata');

// GET /api/system-metadata
router.get('/', (req, res) => {
  res.json(getSystemMetadata());
});

// PUT /api/system-metadata
router.put('/', (req, res) => {
  const updated = updateSystemMetadata(req.body);
  res.json(updated);
});

module.exports = router;
