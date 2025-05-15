const { randomUUID } = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// Since Square doesn't have a built-in scheduling API, we'll simulate one with a JSON file
// In a production app, you would use a database
const SCHEDULE_FILE = path.join(__dirname, '../data/schedule.json');

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Initialize the schedule file if it doesn't exist
async function initScheduleFile() {
  try {
    await fs.access(SCHEDULE_FILE);
  } catch (err) {
    // File doesn't exist, create it
    await ensureDataDir();
    await fs.writeFile(SCHEDULE_FILE, JSON.stringify({ appointments: [] }));
  }
}

// Read the schedule file
async function readSchedule() {
  await initScheduleFile();
  const data = await fs.readFile(SCHEDULE_FILE, 'utf8');
  return JSON.parse(data);
}

// Write to the schedule file
async function writeSchedule(data) {
  await ensureDataDir();
  await fs.writeFile(SCHEDULE_FILE, JSON.stringify(data, null, 2));
}

/**
 * List all appointments
 * @param {Object} options - Options for filtering
 * @returns {Promise<Array>} Array of appointments
 */
async function listAppointments(options = {}) {
  try {
    const { startDate, endDate, customerId } = options;
    const schedule = await readSchedule();
    
    let appointments = schedule.appointments;
    
    // Apply filters
    if (startDate) {
      appointments = appointments.filter(appt => 
        new Date(appt.startTime) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      appointments = appointments.filter(appt => 
        new Date(appt.startTime) <= new Date(endDate)
      );
    }
    
    if (customerId) {
      appointments = appointments.filter(appt => 
        appt.customerId === customerId
      );
    }
    
    return appointments;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

/**
 * Get a single appointment by ID
 * @param {string} appointmentId - The appointment ID
 * @returns {Promise<Object>} The appointment
 */
async function getAppointment(appointmentId) {
  try {
    const schedule = await readSchedule();
    const appointment = schedule.appointments.find(a => a.id === appointmentId);
    
    if (!appointment) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }
    
    return appointment;
  } catch (error) {
    console.error(`Error fetching appointment ${appointmentId}:`, error);
    throw error;
  }
}

/**
 * Create a new appointment
 * @param {Object} appointmentData - The data for the new appointment
 * @returns {Promise<Object>} The created appointment
 */
async function createAppointment(appointmentData) {
  try {
    const schedule = await readSchedule();
    
    // Generate a unique ID
    const id = randomUUID();
    
    const appointment = {
      id,
      title: appointmentData.title || 'Untitled Appointment',
      description: appointmentData.description || '',
      customerId: appointmentData.customerId,
      customerName: appointmentData.customerName || '',
      startTime: appointmentData.startTime || new Date().toISOString(),
      endTime: appointmentData.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      location: appointmentData.location || '',
      status: appointmentData.status || 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    
    schedule.appointments.push(appointment);
    await writeSchedule(schedule);
    
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
}

/**
 * Update an appointment
 * @param {string} appointmentId - The ID of the appointment to update
 * @param {Object} appointmentData - The updated appointment data
 * @returns {Promise<Object>} The updated appointment
 */
async function updateAppointment(appointmentId, appointmentData) {
  try {
    const schedule = await readSchedule();
    const appointmentIndex = schedule.appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }
    
    // Get current appointment
    const currentAppointment = schedule.appointments[appointmentIndex];
    
    // Update with new data
    const updatedAppointment = {
      ...currentAppointment,
      title: appointmentData.title || currentAppointment.title,
      description: appointmentData.description || currentAppointment.description,
      customerId: appointmentData.customerId || currentAppointment.customerId,
      customerName: appointmentData.customerName || currentAppointment.customerName,
      startTime: appointmentData.startTime || currentAppointment.startTime,
      endTime: appointmentData.endTime || currentAppointment.endTime,
      location: appointmentData.location || currentAppointment.location,
      status: appointmentData.status || currentAppointment.status,
      updatedAt: new Date().toISOString()
    };
    
    // Replace in array
    schedule.appointments[appointmentIndex] = updatedAppointment;
    await writeSchedule(schedule);
    
    return updatedAppointment;
  } catch (error) {
    console.error(`Error updating appointment ${appointmentId}:`, error);
    throw error;
  }
}

/**
 * Delete an appointment
 * @param {string} appointmentId - The ID of the appointment to delete
 * @returns {Promise<Object>} Success message
 */
async function deleteAppointment(appointmentId) {
  try {
    const schedule = await readSchedule();
    const appointmentIndex = schedule.appointments.findIndex(a => a.id === appointmentId);
    
    if (appointmentIndex === -1) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }
    
    // Remove from array
    schedule.appointments.splice(appointmentIndex, 1);
    await writeSchedule(schedule);
    
    return { success: true, message: `Appointment ${appointmentId} deleted successfully` };
  } catch (error) {
    console.error(`Error deleting appointment ${appointmentId}:`, error);
    throw error;
  }
}

module.exports = {
  listAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
