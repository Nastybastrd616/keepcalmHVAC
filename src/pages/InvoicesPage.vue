<template>
  <AdminLayout>
    <div class="page-content">
      <header class="page-header">
        <button class="primary-button" @click="openAddInvoiceModal">
          <span class="icon">+</span> Create Invoice
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
          :class="{ active: activeFilter === 'paid' }"
          @click="setFilter('paid')"
        >
          Paid
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'unpaid' }"
          @click="setFilter('unpaid')"
        >
          Unpaid
        </button>
        <button 
          class="filter-button" 
          :class="{ active: activeFilter === 'overdue' }"
          @click="setFilter('overdue')"
        >
          Overdue
        </button>
      </div>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search invoices..."
          @input="filterInvoices"
        />
      </div>
    </div>

    <div class="table-container">
      <table v-if="!loading && filteredInvoices.length" class="data-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id">
            <td>{{ invoice.invoiceNumber || invoice.id.substring(0, 8) }}</td>
            <td>
              <a href="#" class="customer-link" @click.prevent="openProfileModal(invoice.primaryRecipient?.customerId)">
                {{ getCustomerName(invoice.primaryRecipient?.customerId) }}
              </a>
            </td>
            <td>{{ formatCurrency(calculateTotal(invoice)) }}</td>
            <td>
              <span class="status-badge" :class="getStatusClass(invoice.status)">
                {{ formatStatus(invoice.status) }}
              </span>
            </td>
            <td>{{ formatDate(getDueDate(invoice)) }}</td>
            <td class="actions-cell">
              <button class="icon-button" @click="viewInvoice(invoice.id)">
                <span class="icon">👁️</span>
              </button>
              <button class="icon-button" @click="editInvoice(invoice.id)">
                <span class="icon">✏️</span>
              </button>
              <button class="icon-button" @click="resendInvoice(invoice.id)">
                <span class="icon">📧</span>
              </button>
              <button class="icon-button delete" @click="confirmDelete(invoice.id)">
                <span class="icon">🗑️</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading invoices...</p>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>No invoices found</h3>
        <p>Create your first invoice to get started</p>
        <button class="primary-button" @click="openAddInvoiceModal">Create Invoice</button>
      </div>
    </div>

    <!-- Invoice Details Modal -->
    <GenericModal 
      v-if="showInvoiceModal" 
      :title="modalMode === 'add' ? 'Create Invoice' : 'Edit Invoice'" 
      @close="closeInvoiceModal"
    >
      <div class="modal-content">
        <form @submit.prevent="saveInvoice">
          <div class="form-group">
            <label>Customer</label>
            <select v-model="invoiceForm.customerId" required>
              <option value="" disabled>Select a customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                {{ customer.givenName }} {{ customer.familyName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Title</label>
            <input type="text" v-model="invoiceForm.title" required />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="invoiceForm.description"></textarea>
          </div>
          <div class="form-group">
            <label>Due Date</label>
            <input type="date" v-model="invoiceForm.dueDate" required />
          </div>
          
          <h4>Line Items</h4>
          <div class="line-items">
            <div v-for="(item, index) in invoiceForm.lineItems" :key="index" class="line-item">
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
            <button type="button" class="secondary-button" @click="closeInvoiceModal">Cancel</button>
            <button type="submit" class="primary-button" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Invoice' }}
            </button>
          </div>
        </form>
      </div>
    </GenericModal>

    <!-- Delete Confirmation Modal -->
    <GenericModal 
      v-if="showDeleteModal" 
      title="Delete Invoice" 
      @close="closeDeleteModal"
    >
      <div class="modal-content">
        <p>Are you sure you want to delete this invoice? This action cannot be undone.</p>
        <div class="modal-actions">
          <button type="button" class="secondary-button" @click="closeDeleteModal">Cancel</button>
          <button type="button" class="danger-button" @click="deleteInvoice" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete Invoice' }}
          </button>
        </div>
      </div>    </GenericModal>

      <!-- Customer Profile Modal -->
      <CustomerProfileModal
        v-if="showProfileModal"
        :customerId="profileCustomerId"
        :show="showProfileModal"
        @close="closeProfileModal"
      />
  </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useCustomerStore } from '../stores/customerStore';
import GenericModal from '../components/GenericModal.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import CustomerProfileModal from '../components/CustomerProfileModal.vue';

// Stores
const invoiceStore = useInvoiceStore();
const customerStore = useCustomerStore();

// Data
const searchQuery = ref('');
const filteredInvoices = ref([]);
const showInvoiceModal = ref(false);
const showDeleteModal = ref(false);
const showProfileModal = ref(false);
const modalMode = ref('add'); // 'add' or 'edit'
const selectedInvoiceId = ref(null);
const profileCustomerId = ref(null);
const activeFilter = ref('all');
const saving = ref(false);
const deleting = ref(false);

const invoiceForm = ref({
  customerId: '',
  title: '',
  description: '',
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
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
const loading = computed(() => invoiceStore.loading);
const invoices = computed(() => invoiceStore.invoices);
const customers = computed(() => customerStore.customers);

// Methods
function filterInvoices() {
  let filtered = invoices.value;
  
  // Apply status filter
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(invoice => {
      if (activeFilter.value === 'paid') return invoice.status === 'PAID';
      if (activeFilter.value === 'unpaid') return invoice.status === 'UNPAID' || invoice.status === 'OPEN';
      if (activeFilter.value === 'overdue') {
        // Check if invoice is overdue
        const dueDate = getDueDate(invoice);
        return invoice.status !== 'PAID' && new Date(dueDate) < new Date();
      }
      return true;
    });
  }
  
  // Apply search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(invoice => {
      const customerName = getCustomerName(invoice.primaryRecipient?.customerId).toLowerCase();
      return customerName.includes(query) || 
             (invoice.invoiceNumber && invoice.invoiceNumber.toLowerCase().includes(query)) ||
             invoice.id.toLowerCase().includes(query);
    });
  }
  
  filteredInvoices.value = filtered;
}

function setFilter(filter) {
  activeFilter.value = filter;
  filterInvoices();
}

function getCustomerName(customerId) {
  if (!customerId) return 'Unknown';
  
  const customer = customerStore.getCustomerById(customerId);
  if (!customer) return 'Unknown';
  
  return `${customer.givenName} ${customer.familyName}`;
}

function calculateTotal(invoice) {
  if (typeof invoice.amount === 'number') {
    return invoice.amount;
  }
  // Fallback: calculate from line items in first payment request
  if (
    invoice.paymentRequests &&
    invoice.paymentRequests.length > 0 &&
    invoice.paymentRequests[0].lineItems
  ) {
    return invoice.paymentRequests[0].lineItems.reduce((sum, item) => {
      return sum + ((item.basePriceMoney && item.basePriceMoney.amount ? item.basePriceMoney.amount : 0) * (parseInt(item.quantity) || 1));
    }, 0) / 100;
  }
  return 0;
}

function getDueDate(invoice) {
  // Extract due date from payment requests
  if (invoice.paymentRequests && invoice.paymentRequests.length > 0) {
    return invoice.paymentRequests[0].dueDate;
  }
  return 'No due date';
}

function formatStatus(status) {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'DRAFT': 'Draft',
    'OPEN': 'Unpaid',
    'PAID': 'Paid',
    'CANCELED': 'Canceled',
    'UNPAID': 'Unpaid',
    'SCHEDULED': 'Scheduled',
  };
  
  return statusMap[status] || status;
}

function getStatusClass(status) {
  if (!status) return '';
  
  const statusClassMap = {
    'DRAFT': 'status-draft',
    'OPEN': 'status-open',
    'PAID': 'status-paid',
    'CANCELED': 'status-canceled',
    'UNPAID': 'status-unpaid',
    'SCHEDULED': 'status-scheduled',
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
  if (!dateStr || dateStr === 'No due date') return dateStr;
  
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function calculateFormTotal() {
  return invoiceForm.value.lineItems.reduce((total, item) => {
    return total + (item.quantity * item.amount);
  }, 0);
}

function openAddInvoiceModal() {
  modalMode.value = 'add';
  resetForm();
  showInvoiceModal.value = true;
}

function viewInvoice(id) {
  // Navigate to invoice details page or show details modal
  console.log('View invoice:', id);
}

function editInvoice(id) {
  modalMode.value = 'edit';
  selectedInvoiceId.value = id;
  
  // Get invoice data
  const invoice = invoiceStore.getInvoiceById(id);
  if (invoice) {
    const dueDate = getDueDate(invoice);
    
    invoiceForm.value = {
      customerId: invoice.primaryRecipient?.customerId || '',
      title: invoice.title || '',
      description: invoice.description || '',
      dueDate: dueDate !== 'No due date' ? dueDate : new Date().toISOString().split('T')[0],
      lineItems: []
    };
    
    // Convert payment requests to line items
    if (invoice.paymentRequests && invoice.paymentRequests.length > 0 && invoice.paymentRequests[0].lineItems) {
      invoiceForm.value.lineItems = invoice.paymentRequests[0].lineItems.map(item => ({
        name: item.name || '',
        description: item.description || '',
        quantity: parseInt(item.quantity) || 1,
        amount: item.basePriceMoney?.amount ? item.basePriceMoney.amount / 100 : 0
      }));
    } else {
      // Add an empty line item if none exist
      addLineItem();
    }
    
    showInvoiceModal.value = true;
  }
}

function resendInvoice(id) {
  // Logic to resend invoice
  console.log('Resend invoice:', id);
}

function confirmDelete(id) {
  selectedInvoiceId.value = id;
  showDeleteModal.value = true;
}

async function deleteInvoice() {
  if (!selectedInvoiceId.value) return;
  
  deleting.value = true;
  
  try {
    await invoiceStore.deleteInvoice(selectedInvoiceId.value);
    closeDeleteModal();
  } catch (error) {
    console.error('Failed to delete invoice:', error);
    // Show error message
  } finally {
    deleting.value = false;
  }
}

function addLineItem() {
  invoiceForm.value.lineItems.push({
    name: '',
    description: '',
    quantity: 1,
    amount: 0
  });
}

function removeLineItem(index) {
  invoiceForm.value.lineItems.splice(index, 1);
  
  // Ensure there's at least one line item
  if (invoiceForm.value.lineItems.length === 0) {
    addLineItem();
  }
}

async function saveInvoice() {
  saving.value = true;
  
  const invoiceData = {
    customerId: invoiceForm.value.customerId,
    title: invoiceForm.value.title,
    description: invoiceForm.value.description,
    dueDate: invoiceForm.value.dueDate,
    lineItems: invoiceForm.value.lineItems
  };
  
  try {
    if (modalMode.value === 'add') {
      await invoiceStore.createInvoice(invoiceData);
    } else {
      await invoiceStore.updateInvoice(selectedInvoiceId.value, invoiceData);
    }
    
    closeInvoiceModal();
  } catch (error) {
    console.error('Failed to save invoice:', error);
    // Show error message
  } finally {
    saving.value = false;
  }
}

function openProfileModal(id) {
  profileCustomerId.value = id;
  showProfileModal.value = true;
}

function closeProfileModal() {
  showProfileModal.value = false;
  profileCustomerId.value = null;
}

function closeInvoiceModal() {
  showInvoiceModal.value = false;
  resetForm();
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedInvoiceId.value = null;
}

function resetForm() {
  invoiceForm.value = {
    customerId: '',
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    lineItems: [
      { 
        name: '',
        description: '',
        quantity: 1,
        amount: 0
      }
    ]
  };
  selectedInvoiceId.value = null;
}

// Lifecycle hooks
onMounted(async () => {
  if (customerStore.customers.length === 0) {
    await customerStore.fetchCustomers();
  }
  
  await invoiceStore.fetchInvoices();
  filteredInvoices.value = invoices.value;
});
</script>

<style scoped>
body, .page-content, .main-content {
  background-color: #fff !important;
  color: #222;
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-button {
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  color: #222;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.filter-button:hover {
  background: #eaf1fb;
}

.filter-button.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: #fff;
}

.search-bar {
  flex: 1;
  min-width: 200px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 0.5rem 1rem;
}
.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #222;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.data-table th, .data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
  color: #222;
}

.data-table th {
  font-weight: 600;
  color: var(--primary-color);
  background: #fafafa;
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

.status-open, .status-unpaid {
  background: #ffc107;
  color: black;
}

.status-paid {
  background: #28a745;
  color: white;
}

.status-canceled {
  background: #dc3545;
  color: white;
}

.status-scheduled {
  background: #17a2b8;
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
  background: #fff;
  color: #222;
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
  background: #fff;
  color: #222;
  border: 1px solid #ddd;
  padding: 0.75rem;
  border-radius: 6px;
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
  background: #fff;
  color: #222;
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

.customer-link {
  color: var(--primary-color, #3b5998);
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}
.customer-link:hover {
  color: #ff9100;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>