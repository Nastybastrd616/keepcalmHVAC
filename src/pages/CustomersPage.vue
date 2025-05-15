<template>
  <AdminLayout>
    <div class="page-content">

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search customers..."
        @input="filterCustomers"
      />
    </div>

    <div class="table-container">
      <table v-if="!loading && filteredCustomers.length" class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Revenue</th>
            <th>Invoice Count</th>
            <th>Actions</th>
          </tr>=-=--====
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.givenName }} {{ customer.familyName }}</td>
            <td>{{ customer.emailAddress }}</td>
            <td>{{ customer.phoneNumber }}</td>
            <td>{{ calculateRevenue(customer.id) }}</td>
            <td>{{ invoiceCount(customer.id) }}</td>
            <td class="actions-cell">
              <button class="icon-button" @click="viewCustomer(customer.id)">
                <span class="icon">👁️</span>
              </button>
              <button class="icon-button" @click="editCustomer(customer.id)">
                <span class="icon">✏️</span>
              </button>
              <button class="icon-button delete" @click="confirmDelete(customer.id)">
                <span class="icon">🗑️</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading customers...</p>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>No customers found</h3>
        <p>Add your first customer to get started</p>
        <button class="primary-button" @click="openAddCustomerModal">Add Customer</button>
      </div>
    </div>

    <!-- Customer Details Modal -->
    <GenericModal 
      v-if="showCustomerModal" 
      :title="modalMode === 'add' ? 'Add Customer' : 'Edit Customer'" 
      @close="closeCustomerModal"
    >
      <div class="modal-content">
        <form @submit.prevent="saveCustomer">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" v-model="customerForm.firstName" required />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" v-model="customerForm.lastName" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="customerForm.email" required />
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" v-model="customerForm.phone" />
          </div>
          <div class="form-group">
            <label>Address</label>
            <input type="text" v-model="customerForm.address.line1" placeholder="Address Line 1" />
            <input type="text" v-model="customerForm.address.line2" placeholder="Address Line 2" />
            <div class="address-inline">
              <input type="text" v-model="customerForm.address.city" placeholder="City" />
              <input type="text" v-model="customerForm.address.state" placeholder="State" />
              <input type="text" v-model="customerForm.address.postalCode" placeholder="Postal Code" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeCustomerModal">Cancel</button>
            <button type="submit" class="primary-button" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Customer' }}
            </button>
          </div>
        </form>
      </div>
    </GenericModal>

    <!-- Delete Confirmation Modal -->
    <GenericModal 
      v-if="showDeleteModal" 
      title="Delete Customer" 
      @close="closeDeleteModal"
    >
      <div class="modal-content">
        <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="secondary-button" @click="closeDeleteModal">Cancel</button>
          <button type="button" class="danger-button" @click="deleteCustomer" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete Customer' }}
          </button>
        </div>      </div>
    </GenericModal>
  </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCustomerStore } from '../stores/customerStore';
import { useInvoiceStore } from '../stores/invoiceStore';
import GenericModal from '../components/GenericModal.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

// Store
const customerStore = useCustomerStore();
const invoiceStore = useInvoiceStore();

// Data
const searchQuery = ref('');
const filteredCustomers = ref([]);
const showCustomerModal = ref(false);
const showDeleteModal = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const selectedCustomerId = ref(null);
const saving = ref(false);
const deleting = ref(false);

const customerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US'
  }
});

// Computed
const loading = computed(() => customerStore.loading);
const customers = computed(() => customerStore.customers);

// Methods
function filterCustomers() {
  if (!searchQuery.value) {
    filteredCustomers.value = customers.value;
    return;
  }
  
  const query = searchQuery.value.toLowerCase();
  filteredCustomers.value = customers.value.filter(customer => {
    const fullName = `${customer.givenName} ${customer.familyName}`.toLowerCase();
    return fullName.includes(query) || 
           (customer.emailAddress && customer.emailAddress.toLowerCase().includes(query)) ||
           (customer.phoneNumber && customer.phoneNumber.includes(query));
  });
}

function calculateRevenue(customerId) {
  // In a real implementation, this would sum invoice amounts for this customer
  // For now, just show a placeholder
  return '$0.00';
}

function invoiceCount(customerId) {
  // In a real implementation, this would count invoices for this customer
  // For now, just show a placeholder
  return '0';
}

function openAddCustomerModal() {
  modalMode.value = 'add';
  resetForm();
  showCustomerModal.value = true;
}

function viewCustomer(id) {
  // Navigate to customer details page or show details modal
  console.log('View customer:', id);
}

function editCustomer(id) {
  modalMode.value = 'edit';
  selectedCustomerId.value = id;
  
  // Get customer data
  const customer = customerStore.getCustomerById(id);
  if (customer) {
    customerForm.value = {
      firstName: customer.givenName || '',
      lastName: customer.familyName || '',
      email: customer.emailAddress || '',
      phone: customer.phoneNumber || '',
      address: {
        line1: customer.address?.addressLine1 || '',
        line2: customer.address?.addressLine2 || '',
        city: customer.address?.locality || '',
        state: customer.address?.administrativeDistrictLevel1 || '',
        postalCode: customer.address?.postalCode || '',
        country: customer.address?.country || 'US'
      }
    };
    
    showCustomerModal.value = true;
  }
}

function confirmDelete(id) {
  selectedCustomerId.value = id;
  showDeleteModal.value = true;
}

async function deleteCustomer() {
  if (!selectedCustomerId.value) return;
  
  deleting.value = true;
  
  try {
    await customerStore.deleteCustomer(selectedCustomerId.value);
    closeDeleteModal();
  } catch (error) {
    console.error('Failed to delete customer:', error);
    // Show error message
  } finally {
    deleting.value = false;
  }
}

async function saveCustomer() {
  saving.value = true;
  
  const customerData = {
    firstName: customerForm.value.firstName,
    lastName: customerForm.value.lastName,
    email: customerForm.value.email,
    phone: customerForm.value.phone,
    address: customerForm.value.address
  };
  
  try {
    if (modalMode.value === 'add') {
      await customerStore.createCustomer(customerData);
    } else {
      await customerStore.updateCustomer(selectedCustomerId.value, customerData);
    }
    
    closeCustomerModal();
  } catch (error) {
    console.error('Failed to save customer:', error);
    // Show error message
  } finally {
    saving.value = false;
  }
}

function closeCustomerModal() {
  showCustomerModal.value = false;
  resetForm();
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedCustomerId.value = null;
}

function resetForm() {
  customerForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US'
    }
  };
  selectedCustomerId.value = null;
}

// Lifecycle hooks
onMounted(async () => {
  await customerStore.fetchCustomers();
  filteredCustomers.value = customers.value;
});
</script>

<style scoped>
.page-content {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--card-radius);
  border: var(--card-border);
  background: #333333;
}

.table-container {
  background: #333333;
  border-radius: var(--card-radius);
  padding: 1rem;
  box-shadow: var(--card-shadow);
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #3a3a3a;
  color: #ffffff;
}

.address-inline {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
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
