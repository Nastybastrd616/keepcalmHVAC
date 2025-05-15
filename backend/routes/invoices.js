const express = require('express');
const router = express.Router();
const { 
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice 
} = require('../services/invoices');

// GET /api/invoices - List all invoices
router.get('/', async (req, res, next) => {
  try {
    const { cursor, limit, locationId } = req.query;
    const result = await listInvoices({ cursor, limit, locationId });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/:id - Get a single invoice
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getInvoice(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices - Create a new invoice
router.post('/', async (req, res, next) => {
  try {
    const invoiceData = req.body;
    const result = await createInvoice(invoiceData);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// PUT /api/invoices/:id - Update an existing invoice
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoiceData = req.body;
    const result = await updateInvoice(id, invoiceData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/invoices/:id - Delete an invoice
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { version } = req.query;
    const result = await deleteInvoice(id, version);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
