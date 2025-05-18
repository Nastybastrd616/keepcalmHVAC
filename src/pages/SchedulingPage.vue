<template>
  <AdminLayout>
    <div class="page-content">
    <header class="page-header">
      <h1>Scheduling</h1>
      <button class="primary-button" @click="openAddAppointmentModal">
        <span class="icon">+</span> Add Appointment
      </button>
    </header>

    <!-- Calendar View -->
    <div class="calendar-container">
      <AdvancedCalendar 
        :appointments="appointments" 
        @select-date="handleDateSelect"
        @select-appointment="viewAppointment"
      />
    </div>

    <!-- Appointments List -->
    <div class="appointments-container">
      <h2>Upcoming Appointments</h2>

      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search appointments..." 
          @input="filterAppointments"
        />
        <div class="date-filters">
          <input 
            type="date" 
            v-model="startDate" 
            @change="filterAppointments"
          />
          <span>to</span>
          <input 
            type="date" 
            v-model="endDate" 
            @change="filterAppointments"
          />
        </div>
      </div>

      <div class="table-container">
        <table v-if="!loading && filteredAppointments.length" class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Customer</th>
              <th>Date/Time</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appointment in filteredAppointments" :key="appointment.id">
              <td>{{ appointment.title }}</td>
              <td>{{ appointment.customerName }}</td>
              <td>{{ formatDateTime(appointment.startTime) }}</td>
              <td>{{ appointment.location }}</td>
              <td>
                <span class="status-badge" :class="getStatusClass(appointment.status)">
                  {{ appointment.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="icon-button" @click="viewAppointment(appointment.id)">
                  <span class="icon">👁️</span>
                </button>
                <button class="icon-button" @click="editAppointment(appointment.id)">
                  <span class="icon">✏️</span>
                </button>
                <button class="icon-button delete" @click="confirmDelete(appointment.id)">
                  <span class="icon">🗑️</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading appointments...</p>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>No appointments found</h3>
          <p>Schedule your first appointment to get started</p>
          <button class="primary-button" @click="openAddAppointmentModal">Schedule Appointment</button>
        </div>
      </div>
    </div>

    <!-- Appointment Modal -->
    <GenericModal 
      v-if="showAppointmentModal" 
      :title="modalMode === 'add' ? 'Add Appointment' : 'Edit Appointment'" 
      @close="closeAppointmentModal"
    >
      <div class="modal-content">
        <form @submit.prevent="saveAppointment">
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="appointmentForm.title" required />
          </div>

          <div class="form-group">
            <label>Customer</label>
            <select v-model="appointmentForm.customerId" required>
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.givenName }} {{ customer.familyName }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input type="date" v-model="appointmentForm.date" required />
            </div>
            <div class="form-group">
              <label>Start Time</label>
              <input type="time" v-model="appointmentForm.startTime" required />
            </div>
            <div class="form-group">
              <label>End Time</label>
              <input type="time" v-model="appointmentForm.endTime" required />
            </div>
          </div>

          <div class="form-group">
            <label>Location</label>
            <input type="text" v-model="appointmentForm.location" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="appointmentForm.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="appointmentForm.status">
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeAppointmentModal">Cancel</button>
            <button type="submit" class="primary-button" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Appointment' }}
            </button>
          </div>
        </form>
      </div>
    </GenericModal>

    <!-- Delete Confirmation Modal -->
    <GenericModal 
      v-if="showDeleteModal" 
      title="Delete Appointment" 
      @close="closeDeleteModal"
    >
      <div class="modal-content">
        <p>Are you sure you want to delete this appointment? This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="secondary-button" @click="closeDeleteModal">Cancel</button>
          <button type="button" class="danger-button" @click="deleteAppointment" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete Appointment' }}
          </button>
        </div>      </div>
    </GenericModal>
  </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useScheduleStore } from '../stores/scheduleStore';
import AdminLayout from '../layouts/AdminLayout.vue';
import { useCustomerStore } from '../stores/customerStore';
import GenericModal from '../components/GenericModal.vue';
import AdvancedCalendar from '../components/AdvancedCalendar.vue';

// Stores
const scheduleStore = useScheduleStore();
const customerStore = useCustomerStore();

// Data
const searchQuery = ref('');
const startDate = ref('');
const endDate = ref('');
const filteredAppointments = ref([]);
const showAppointmentModal = ref(false);
const showDeleteModal = ref(false);
const modalMode = ref('add');
const selectedAppointmentId = ref(null);
const selectedDate = ref(null);
const saving = ref(false);
const deleting = ref(false);

const appointmentForm = ref({
  title: '',
  customerId: '',
  customerName: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  description: '',
  status: 'CONFIRMED'
});

// Computed
const loading = computed(() => scheduleStore.loading);
const appointments = computed(() => scheduleStore.appointments);
const customers = computed(() => customerStore.customers);

// Format date and time for display
function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', { 
    dateStyle: 'medium',
    timeStyle: 'short' 
  }).format(date);
}

// Get CSS class based on status
function getStatusClass(status) {
  const statusMap = {
    'CONFIRMED': 'status-confirmed',
    'PENDING': 'status-pending',
    'CANCELLED': 'status-cancelled',
    'COMPLETED': 'status-completed'
  };
  return statusMap[status] || '';
}

// Filter appointments based on search query and date range
function filterAppointments() {
  if (!searchQuery.value && !startDate.value && !endDate.value) {
    filteredAppointments.value = appointments.value;
    return;
  }
  
  let filtered = [...appointments.value];
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(appointment => {
      return appointment.title.toLowerCase().includes(query) ||
             appointment.customerName.toLowerCase().includes(query) ||
             appointment.location.toLowerCase().includes(query);
    });
  }
  
  // Filter by date range
  if (startDate.value) {
    const start = new Date(startDate.value);
    filtered = filtered.filter(appointment => {
      return new Date(appointment.startTime) >= start;
    });
  }
  
  if (endDate.value) {
    const end = new Date(endDate.value);
    end.setHours(23, 59, 59); // End of the day
    filtered = filtered.filter(appointment => {
      return new Date(appointment.startTime) <= end;
    });
  }
  
  filteredAppointments.value = filtered;
}

// Handle calendar date selection
function handleDateSelect(date) {
  selectedDate.value = date;
  
  // Set the form date to the selected date
  if (date) {
    const formattedDate = date.toISOString().split('T')[0];
    appointmentForm.value.date = formattedDate;
    
    // Filter appointments to show only those for the selected date
    startDate.value = formattedDate;
    endDate.value = formattedDate;
    filterAppointments();
  }
}

// Open modal to add new appointment
function openAddAppointmentModal() {
  modalMode.value = 'add';
  resetForm();
  
  // If a date is selected in the calendar, use that
  if (selectedDate.value) {
    appointmentForm.value.date = selectedDate.value.toISOString().split('T')[0];
  }
  
  showAppointmentModal.value = true;
}

// View appointment details
function viewAppointment(id) {
  // For now, just open the edit modal
  editAppointment(id);
}

// Open modal to edit an appointment
function editAppointment(id) {
  modalMode.value = 'edit';
  selectedAppointmentId.value = id;
  
  // Get appointment data
  const appointment = scheduleStore.getAppointmentById(id);
  if (appointment) {
    const startDate = new Date(appointment.startTime);
    const endDate = new Date(appointment.endTime);
    
    appointmentForm.value = {
      title: appointment.title || '',
      customerId: appointment.customerId || '',
      customerName: appointment.customerName || '',
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5),
      location: appointment.location || '',
      description: appointment.description || '',
      status: appointment.status || 'CONFIRMED'
    };
    
    showAppointmentModal.value = true;
  }
}

// Confirm appointment deletion
function confirmDelete(id) {
  selectedAppointmentId.value = id;
  showDeleteModal.value = true;
}

// Delete an appointment
async function deleteAppointment() {
  if (!selectedAppointmentId.value) return;
  
  deleting.value = true;
  
  try {
    await scheduleStore.deleteAppointment(selectedAppointmentId.value);
    closeDeleteModal();
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    // Show error message
  } finally {
    deleting.value = false;
  }
}

// Save appointment (create or update)
async function saveAppointment() {
  saving.value = true;
  
  try {
    // Get the customer name for display
    let customerName = '';
    if (appointmentForm.value.customerId) {
      const customer = customerStore.getCustomerById(appointmentForm.value.customerId);
      if (customer) {
        customerName = `${customer.givenName} ${customer.familyName}`;
      }
    }
    
    // Combine date and time into ISO strings
    const startDateTime = new Date(`${appointmentForm.value.date}T${appointmentForm.value.startTime}`);
    const endDateTime = new Date(`${appointmentForm.value.date}T${appointmentForm.value.endTime}`);
    
    const appointmentData = {
      title: appointmentForm.value.title,
      customerId: appointmentForm.value.customerId,
      customerName: customerName,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      location: appointmentForm.value.location,
      description: appointmentForm.value.description,
      status: appointmentForm.value.status
    };
    
    if (modalMode.value === 'add') {
      await scheduleStore.createAppointment(appointmentData);
    } else {
      await scheduleStore.updateAppointment(selectedAppointmentId.value, appointmentData);
    }
    
    closeAppointmentModal();
  } catch (error) {
    console.error('Failed to save appointment:', error);
    // Show error message
  } finally {
    saving.value = false;
  }
}

// Close appointment modal
function closeAppointmentModal() {
  showAppointmentModal.value = false;
  resetForm();
}

// Close delete confirmation modal
function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedAppointmentId.value = null;
}

// Reset form fields
function resetForm() {
  appointmentForm.value = {
    title: '',
    customerId: '',
    customerName: '',
    date: selectedDate.value ? selectedDate.value.toISOString().split('T')[0] : '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    status: 'CONFIRMED'
  };
  selectedAppointmentId.value = null;
}

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    scheduleStore.fetchAppointments(),
    customerStore.fetchCustomers()
  ]);
  
  filteredAppointments.value = appointments.value;
  
  // Set default date range to current month
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  startDate.value = firstDay.toISOString().split('T')[0];
  endDate.value = lastDay.toISOString().split('T')[0];
  
  // Initialize selected date to today
  selectedDate.value = now;
  
  // Apply initial filters
  filterAppointments();
});
</script>

<style scoped>
body, .page-content, .main-content {
  background-color: #fff !important;
}

.page-content {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.calendar-container {
  background: #333333;
  border-radius: var(--card-radius);
  padding: 1rem;
  box-shadow: var(--card-shadow);
  margin-bottom: 1.5rem;
}

.appointments-container {
  background: #333333;
  border-radius: var(--card-radius);
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #3a3a3a;
  color: #ffffff;
}

.date-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.data-table th {
  font-weight: 600;
  color: var(--primary-color);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-confirmed {
  background-color: #4CAF50;
  color: white;
}

.status-pending {
  background-color: #FFC107;
  color: black;
}

.status-cancelled {
  background-color: #F44336;
  color: white;
}

.status-completed {
  background-color: #2196F3;
  color: white;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.icon-button:hover {
  transform: scale(1.2);
}

.icon-button.delete:hover {
  color: #ff3d3d;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.primary-button {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.primary-button:hover {
  background: #4d6bb3;
}

.secondary-button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.secondary-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.danger-button {
  background: #ff3d3d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.danger-button:hover {
  background: #ff5f5f;
}

.modal-content {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #3a3a3a;
  color: #ffffff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
