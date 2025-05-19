<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal profile-modal">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading customer profile...</p>
      </div>
      <div v-else-if="customer">
        <h2>{{ customer.givenName }} {{ customer.familyName }}</h2>
        <div class="profile-section">
          <div class="profile-info">
            <p><strong>Email:</strong> {{ customer.emailAddress || 'N/A' }}</p>
            <p><strong>Phone:</strong> {{ customer.phoneNumber || 'N/A' }}</p>
            <p><strong>Address:</strong>
              <span v-if="customer.address">
                {{ customer.address.addressLine1 }}<span v-if="customer.address.addressLine2">, {{ customer.address.addressLine2 }}</span>,
                {{ customer.address.locality }}, {{ customer.address.administrativeDistrictLevel1 }} {{ customer.address.postalCode }}
              </span>
              <span v-else>N/A</span>
            </p>
          </div>
          <div class="profile-stats">
            <p><strong>Total Revenue:</strong> {{ formatCurrency(totalRevenue) }}</p>
            <p><strong>Invoice Count:</strong> {{ recentInvoices.length }}</p>
          </div>
        </div>
        <div class="recent-invoices">
          <h3>Recent Invoices</h3>
          <table v-if="recentInvoices.length" class="invoices-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inv in recentInvoices" :key="inv.id">
                <td>{{ inv.id }}</td>
                <td>{{ formatCurrency(inv.amount) }}</td>
                <td>{{ inv.status }}</td>
                <td>{{ formatDate(inv.dueDate) }}</td>
              </tr>
            </tbody>
          </table>
          <div v-else class="empty-state">No invoices found for this customer.</div>
        </div>
      </div>
      <div v-else class="empty-state">Customer not found.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useCustomerStore } from '../stores/customerStore';
import { useInvoiceStore } from '../stores/invoiceStore';

const props = defineProps({
  customerId: { type: String, required: true },
  show: { type: Boolean, default: false }
});

const customerStore = useCustomerStore();
const invoiceStore = useInvoiceStore();

const customer = ref(null);
const recentInvoices = ref([]);
const loading = ref(true);
const totalRevenue = ref(0);

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function loadProfile() {
  loading.value = true;
  customer.value = null;
  recentInvoices.value = [];
  totalRevenue.value = 0;
  if (!props.customerId) return;
  // Fetch customer
  customer.value = await customerStore.fetchCustomer(props.customerId);
  // Fetch invoices for this customer
  await invoiceStore.fetchInvoices();
  const allInvoices = invoiceStore.invoices.filter(inv => inv.primaryRecipient?.customerId === props.customerId);
  recentInvoices.value = allInvoices.slice(0, 5);
  totalRevenue.value = allInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  loading.value = false;
}

watch(() => props.customerId, loadProfile, { immediate: true });
onMounted(loadProfile);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.profile-modal {
  background: #fff;
  color: #222;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  min-width: 400px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  position: relative;
}
.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
}
.profile-section {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.profile-info p, .profile-stats p {
  margin: 0.25rem 0;
}
.profile-stats {
  min-width: 160px;
}
.recent-invoices {
  margin-top: 1.5rem;
}
.invoices-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}
.invoices-table th, .invoices-table td {
  border: 1px solid #eee;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
.invoices-table th {
  background: #f8f8f8;
}
.loading-state, .empty-state {
  text-align: center;
  color: #888;
  margin: 2rem 0;
}
.spinner {
  border: 4px solid #eee;
  border-top: 4px solid #3b5998;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
