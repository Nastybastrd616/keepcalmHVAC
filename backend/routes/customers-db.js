const express = require('express');
const router = express.Router();
const {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} = require('../services/customers-db');

// GET /api/customers-db
router.get('/', (req, res) => {
  res.json(getCustomers());
});

// POST /api/customers-db
router.post('/', (req, res) => {
  const customer = addCustomer(req.body);
  res.status(201).json(customer);
});

// PUT /api/customers-db/:id
router.put('/:id', (req, res) => {
  const updated = updateCustomer(req.params.id, req.body);
  if (updated) res.json(updated);
  else res.status(404).json({ error: 'Customer not found' });
});

// DELETE /api/customers-db/:id
router.delete('/:id', (req, res) => {
  deleteCustomer(req.params.id);
  res.json({ success: true });
});

module.exports = router;
