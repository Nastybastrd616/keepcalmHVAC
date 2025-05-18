const express = require('express');
const router = express.Router();
const { 
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer 
} = require('../services/customers');

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

// GET /api/customers - List all customers
router.get('/', async (req, res, next) => {
  try {
    const { cursor, limit } = req.query;
    const result = await listCustomers({ cursor, limit });
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

// GET /api/customers/:id - Get a single customer
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getCustomer(id);
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

// POST /api/customers - Create a new customer
router.post('/', async (req, res, next) => {
  try {
    const customerData = req.body;
    const result = await createCustomer(customerData);
    res.status(201).json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

// PUT /api/customers/:id - Update an existing customer
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const customerData = req.body;
    const result = await updateCustomer(id, customerData);
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

// DELETE /api/customers/:id - Delete a customer
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteCustomer(id);
    res.json(convertBigIntToString(result));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
