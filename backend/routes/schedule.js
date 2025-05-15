const express = require('express');
const router = express.Router();
const { 
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment 
} = require('../services/schedule');

// GET /api/schedule - List all appointments
router.get('/', async (req, res, next) => {
  try {
    const { startDate, endDate, customerId } = req.query;
    const result = await listAppointments({ startDate, endDate, customerId });
    res.json({ appointments: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/schedule/:id - Get a single appointment
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getAppointment(id);
    res.json({ appointment: result });
  } catch (error) {
    next(error);
  }
});

// POST /api/schedule - Create a new appointment
router.post('/', async (req, res, next) => {
  try {
    const appointmentData = req.body;
    const result = await createAppointment(appointmentData);
    res.status(201).json({ appointment: result });
  } catch (error) {
    next(error);
  }
});

// PUT /api/schedule/:id - Update an existing appointment
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointmentData = req.body;
    const result = await updateAppointment(id, appointmentData);
    res.json({ appointment: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/schedule/:id - Delete an appointment
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deleteAppointment(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
