const express = require('express');
const router = express.Router();
const { 
  listCatalogItems,
  getCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  testConnection 
} = require('../services/square');

// GET /api/catalog/test-connection - Test Square API connection
router.get('/test-connection', async (req, res, next) => {
  try {
    const result = await testConnection();
    
    // Check if the connection worked but environment vars might be wrong
    if (result && result.success && !process.env.SQUARE_ACCESS_TOKEN) {
      console.warn('Connection successful but environment variables not loaded properly');
      return res.json({ 
        success: true, 
        message: 'Connection successful, but environment variables may need server restart', 
        data: result,
        needsRestart: true
      });
    }
    
    res.json({ success: true, message: 'Connection successful', data: result });
  } catch (error) {
    console.error('Connection test failed:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Connection test failed'
    });
  }
});

// GET /api/catalog - List all catalog items
router.get('/', async (req, res, next) => {
  try {
    const { cursor, types } = req.query;
    const result = await listCatalogItems({ cursor, types });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/catalog/:id - Get a single catalog item
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getCatalogItem(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/catalog - Create a new catalog item
router.post('/', async (req, res, next) => {
  try {
    const itemData = req.body;
    const result = await createCatalogItem(itemData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/catalog/:id - Update an existing catalog item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const itemData = req.body;
    const result = await updateCatalogItem(id, itemData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/catalog/:id - Delete a catalog item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteCatalogItem(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
