const express = require('express');
const router = express.Router();
const { 
  listEstimates,
  getEstimate,
  createEstimate,
  updateEstimate,
  deleteEstimate,
  convertEstimateToInvoice
} = require('../services/estimates');

// GET /api/estimates - List all estimates
router.get('/', async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const result = await listEstimates({ cursor });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/estimates/:id - Get a single estimate
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getEstimate(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/estimates - Create a new estimate
router.post('/', async (req, res, next) => {
  try {
    const estimateData = req.body;
    const result = await createEstimate(estimateData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/estimates/:id - Update an existing estimate
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const estimateData = req.body;
    const result = await updateEstimate(id, estimateData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/estimates/:id - Delete an estimate
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteEstimate(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/estimates/:id/convert - Convert estimate to invoice
router.post('/:id/convert', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await convertEstimateToInvoice(id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
