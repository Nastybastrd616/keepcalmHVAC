<template>
  <AdminLayout>
    <div class="page-content">
    <header class="page-header">
      <h1>Estimates</h1>
      <button class="primary-button" @click="openAddEstimateModal">
        <span class="icon">+</span> Create Estimate
      </button>
    </header>

    <div class="filters-bar">
      <div class="filter-buttons">
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'all' }" 
          @click="setFilter('all')"
        >
          All
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'draft' }"
          @click="setFilter('draft')"
        >
          Draft
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'sent' }"
          @click="setFilter('sent')"
        >
          Sent
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'accepted' }"
          @click="setFilter('accepted')"
        >
          Accepted
        </button>
      </div>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search estimates..."
          @input="filterEstimates"
        />
      </div>
    </div>

    <div class="table-container">
      <table v-if="!loading && filteredEstimates.length" class="data-table">
        <thead>
          <tr>
            <th>Estimate #</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="estimate in filteredEstimates" :key="estimate.id">
            <td>{{ estimate.id.substring(0, 8) }}</td>
            <td>{{ getCustomerName(getCustomerId(estimate)) }}</td>
            <td>{{ formatCurrency(getAmount(estimate)) }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(getStatus(estimate))">
                {{ formatStatus(getStatus(estimate)) }}
              </span>
            </td>
            <td>{{ formatDate(getDate(estimate)) }}</td>
            <td class="actions-cell">
              <button class="icon-button" @click="viewEstimate(estimate.id)">
                <span class="icon">👁️</span>
              </button>
              <button class="icon-button" @click="editEstimate(estimate.id)">
                <span class="icon">✏️</span>
              </button>
              <button class="icon-button" @click="convertToInvoice(estimate.id)">
                <span class="icon">🔄</span>
              </button>
              <button class="icon-button delete" @click="confirmDelete(estimate.id)">
                <span class="icon">🗑️</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading estimates...</p>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📑</div>
        <h3>No estimates found</h3>
        <p>Create your first estimate to get started</p>
        <button class="primary-button" @click="openAddEstimateModal">Create Estimate</button>
      </div>
    </div>

    <!-- Estimate Details Modal -->
    <GenericModal 
      v-if="showEstimateModal" 
      :title="modalMode === 'add' ? 'Create Estimate' : 'Edit Estimate'" 
      @close="closeEstimateModal"
    >
      <div class="modal-content">
        <form @submit.prevent="saveEstimate">
          <div class="form-group">
            <label>Customer</label>
            <select v-model="estimateForm.customerId" required>
              <option value="" disabled>Select a customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.givenName }} {{ customer.familyName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="estimateForm.title" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="estimateForm.description"></textarea>
          </div>
          <div class="form-group">
            <label>Due Date</label>
            <input type="date" v-model="estimateForm.dueDate" required />
          </div>
          
          <h4>Line Items</h4>
          <div class="line-items">
            <div v-for="(item, index) in estimateForm.lineItems" :key="index" class="line-item">
              <div class="line-item-fields">
                <input type="text" v-model="item.name" placeholder="Item name" required />
                <input type="text" v-model="item.description" placeholder="Description" />
                <input type="number" v-model="item.quantity" placeholder="Qty" min="1" required />
                <input type="number" v-model="item.amount" placeholder="Amount" step="0.01" min="0" required />
                <button type="button" class="icon-button delete" @click="removeLineItem(index)">
                  <span class="icon">🗑️</span>
                </button>
              </div>
            </div>
            <button type="button" class="secondary-button" @click="addLineItem">
              + Add Line Item
            </button>
          </div>
          
          <div class="invoice-summary">
            <div class="total">Total: {{ formatCurrency(calculateFormTotal()) }}</div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeEstimateModal">Cancel</button>
            <button type="submit" class="primary-button" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Estimate' }}
            </button>
          </div>
        </form>
      </div>
    </GenericModal>

    <!-- Convert to Invoice Modal -->
    <GenericModal 
      v-if="showConvertModal" 
      title="Convert to Invoice" 
      @close="closeConvertModal"
    >
      <div class="modal-content">
        <p>Convert this estimate to an invoice? This will create a new invoice with the same details.</p>
        <div class="modal-actions">
          <button type="button" class="secondary-button" @click="closeConvertModal">Cancel</button>
          <button type="button" class="primary-button" @click="confirmConvertToInvoice" :disabled="converting">
            {{ converting ? 'Converting...' : 'Convert to Invoice' }}
          </button>
        </div>
      </div>
    </GenericModal>

    <!-- Delete Confirmation Modal -->
    <GenericModal 
      v-if="showDeleteModal" 
      title="Delete Estimate" 
      @close="closeDeleteModal"
    >
      <div class="modal-content">
        <p>Are you sure you want to delete this estimate? This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="secondary-button" @click="closeDeleteModal">Cancel</button>
          <button type="button" class="danger-button" @click="deleteEstimate" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete Estimate' }}
          </button>
        </div>      </div>
    </GenericModal>
  </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useEstimateStore } from '../stores/estimateStore';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useCustomerStore } from '../stores/customerStore';
import GenericModal from '../components/GenericModal.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

// Stores
const estimateStore = useEstimateStore();
const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();

// Data
const searchQuery = ref('');
const filteredEstimates = ref([]);
const showEstimateModal = ref(false);
const showDeleteModal = ref(false);
const showConvertModal = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const selectedEstimateId = ref(null);
const activeFilter = ref('all');
const saving = ref(false);
const deleting = ref(false);
const converting = ref(false);

const estimateForm = ref({
  customerId: '',
  title: '',
  description: '',
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  status: 'DRAFT',
  lineItems: [
    { 
      name: '',
      description: '',
      quantity: 1,
      amount: 0
    }
  ]
});

// Computed
const loading = computed(() => estimateStore.loading);
const estimates = computed(() => estimateStore.estimates);
const customers = computed(() => customerStore.customers);

// Methods
function filterEstimates() {
  let filtered = estimates.value;
  
  // Apply status filter
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(estimate => {
      const status = getStatus(estimate).toLowerCase();
      return status === activeFilter.value;
    });
  }
  
  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(estimate => {
      const customerName = getCustomerName(getCustomerId(estimate)).toLowerCase();
      return customerName.includes(query) || 
             estimate.id.toLowerCase().includes(query);
    });
  }
  
  filteredEstimates.value = filtered;
}

function setFilter(filter) {
  activeFilter.value = filter;
  filterEstimates();
}

function getCustomerName(customerId) {
  if (!customerId) return 'Unknown';
  
  const customer = customerStore.getCustomerById(customerId);
  if (!customer) return 'Unknown';
  
  return `${customer.givenName} ${customer.familyName}`;
}

function getCustomerId(estimate) {
  // Extract customer ID from custom attributes
  if (estimate.customAttributes && estimate.customAttributes.customer_id) {
    return estimate.customAttributes.customer_id.stringValue;
  }
  return null;
}

function getStatus(estimate) {
  // Extract status from custom attributes
  if (estimate.customAttributes && estimate.customAttributes.status) {
    return estimate.customAttributes.status.stringValue;
  }
  return 'DRAFT';
}

function getAmount(estimate) {
  // Extract amount from custom attributes
  if (estimate.customAttributes && estimate.customAttributes.amount) {
    return parseFloat(estimate.customAttributes.amount.stringValue) || 0;
  }
  return 0;
}

function getDate(estimate) {
  // Extract date from custom attributes
  if (estimate.customAttributes && estimate.customAttributes.created_at) {
    return estimate.customAttributes.created_at.stringValue;
  }
  return null;
}

function formatStatus(status) {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'DRAFT': 'Draft',
    'SENT': 'Sent',
    'ACCEPTED': 'Accepted',
    'REJECTED': 'Rejected',
    'EXPIRED': 'Expired',
    'CONVERTED': 'Converted',
  };
  
  return statusMap[status] || status;
}

function getStatusClass(status) {
  if (!status) return '';
  
  const statusClassMap = {
    'DRAFT': 'status-draft',
    'SENT': 'status-sent',
    'ACCEPTED': 'status-accepted',
    'REJECTED': 'status-rejected',
    'EXPIRED': 'status-expired',
    'CONVERTED': 'status-converted',
  };
  
  return statusClassMap[status] || '';
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function calculateFormTotal() {
  return estimateForm.value.lineItems.reduce((total, item) => {
    return total + (item.quantity * item.amount);
  }, 0);
}

function openAddEstimateModal() {
  modalMode.value = 'add';
  resetForm();
  showEstimateModal.value = true;
}

function viewEstimate(id) {
  // Navigate to estimate details page or show details modal
  console.log('View estimate:', id);
}

function editEstimate(id) {
  modalMode.value = 'edit';
  selectedEstimateId.value = id;
  
  // Get estimate data
  const estimate = estimateStore.getEstimateById(id);
  if (estimate) {
    estimateForm.value = {
      customerId: getCustomerId(estimate) || '',
      title: estimate.customAttributes?.title?.stringValue || '',
      description: estimate.customAttributes?.description?.stringValue || '',
      dueDate: estimate.customAttributes?.due_date?.stringValue || new Date().toISOString().split('T')[0],
      status: getStatus(estimate),
      lineItems: []
    };
    
    // In a real implementation, you'd parse line items from the estimate
    // For now, we'll just add an empty line item
    addLineItem();
    
    showEstimateModal.value = true;
  }
}

function convertToInvoice(id) {
  selectedEstimateId.value = id;
  showConvertModal.value = true;
}

async function confirmConvertToInvoice() {
  if (!selectedEstimateId.value) return;
  
  converting.value = true;
  
  try {
    // Convert estimate to invoice
    const result = await estimateStore.convertEstimateToInvoice(selectedEstimateId.value);
    
    // Show success message or redirect to the new invoice
    console.log('Estimate converted to invoice:', result);
    
    closeConvertModal();
  } catch (error) {
    console.error('Failed to convert estimate:', error);
    // Show error message
  } finally {
    converting.value = false;
  }
}

function confirmDelete(id) {
  selectedEstimateId.value = id;
  showDeleteModal.value = true;
}

async function deleteEstimate() {
  if (!selectedEstimateId.value) return;
  
  deleting.value = true;
  
  try {
    await estimateStore.deleteEstimate(selectedEstimateId.value);
    closeDeleteModal();
  } catch (error) {
    console.error('Failed to delete estimate:', error);
    // Show error message
  } finally {
    deleting.value = false;
  }
}

function addLineItem() {
  estimateForm.value.lineItems.push({
    name: '',
    description: '',
    quantity: 1,
    amount: 0
  });
}

function removeLineItem(index) {
  estimateForm.value.lineItems.splice(index, 1);
  
  // Ensure there's at least one line item
  if (estimateForm.value.lineItems.length === 0) {
    addLineItem();
  }
}

async function saveEstimate() {
  saving.value = true;
  
  const estimateData = {
    customerId: estimateForm.value.customerId,
    title: estimateForm.value.title,
    description: estimateForm.value.description,
    dueDate: estimateForm.value.dueDate,
    status: estimateForm.value.status,
    amount: calculateFormTotal()
  };
  
  try {
    if (modalMode.value === 'add') {
      await estimateStore.createEstimate(estimateData);
    } else {
      await estimateStore.updateEstimate(selectedEstimateId.value, estimateData);
    }
    
    closeEstimateModal();
  } catch (error) {
    console.error('Failed to save estimate:', error);
    // Show error message
  } finally {
    saving.value = false;
  }
}

function closeEstimateModal() {
  showEstimateModal.value = false;
  resetForm();
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedEstimateId.value = null;
}

function closeConvertModal() {
  showConvertModal.value = false;
  selectedEstimateId.value = null;
}

function resetForm() {
  estimateForm.value = {
    customerId: '',
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    status: 'DRAFT',
    lineItems: [
      { 
        name: '',
        description: '',
        quantity: 1,
        amount: 0
      }
    ]
  };
  selectedEstimateId.value = null;
}

// Lifecycle hooks
onMounted(async () => {
  if (customerStore.customers.length === 0) {
    await customerStore.fetchCustomers();
  }
  
  await estimateStore.fetchEstimates();
  filteredEstimates.value = estimates.value;
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

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

.filter-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.search-bar {
  flex: 1;
  min-width: 200px;
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

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-draft {
  background: #6c757d;
  color: white;
}

.status-sent {
  background: #17a2b8;
  color: white;
}

.status-accepted {
  background: #28a745;
  color: white;
}

.status-rejected {
  background: #dc3545;
  color: white;
}

.status-expired {
  background: #6c757d;
  color: white;
}

.status-converted {
  background: #9c27b0;
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

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #3a3a3a;
  color: #ffffff;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.line-items {
  margin-bottom: 1.5rem;
}

.line-item {
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 1rem;
}

.line-item-fields {
  display: grid;
  grid-template-columns: 1fr 2fr 80px 120px 40px;
  gap: 0.5rem;
  align-items: center;
}

.invoice-summary {
  margin-top: 1.5rem;
  text-align: right;
}

.total {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
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
