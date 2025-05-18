const express = require('express');
const router = express.Router();
const { 
  listInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice 
} = require('../services/invoices');

// Utility to convert BigInt values to strings recursively
function convertBigIntToString(obj) {
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(convertBigIntToString);
  if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertBigIntToString(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// GET /api/invoices - List all invoices
router.get('/', async (req, res, next) => {
  try {
    const { cursor, limit, locationId } = req.query;
    const result = await listInvoices({ cursor, limit, locationId });
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

// GET /api/invoices/:id - Get a single invoice
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getInvoice(id);
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices - Create a new invoice
router.post('/', async (req, res, next) => {
  try {
    const invoiceData = req.body;
    const result = await createInvoice(invoiceData);
    res.status(201).json(convertBigIntToString(result));
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
    res.json(convertBigIntToString(result));
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
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
