<template>
  <div class="dashboard-page">
    <h1>Customer Dashboard</h1>
    
    <!-- Dashboard Tabs -->
    <div class="dashboard-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
        class="tab-btn"
      >
        {{ tab.name }}
      </button>
    </div>
    
    <!-- Equipment Tab -->
    <div v-show="activeTab === 'equipment'" class="tab-content">
      <EquipmentManager :userId="userId" @scheduleService="openServiceScheduler" />
    </div>
    
    <!-- Maintenance Plan Tab -->
    <div v-show="activeTab === 'maintenance'" class="tab-content">
      <MaintenancePlans :user="user" @openLogin="$emit('goTo', 'login')" />
    </div>
    
    <!-- Service Request Tab -->
    <div v-show="activeTab === 'service'" class="tab-content">
      <section class="service-request">
        <h2>Request Service</h2>
        <div class="service-options">
          <div class="service-option" @click="serviceType = 'standard'">
            <h3>Standard Service</h3>
            <p>Schedule a routine maintenance visit</p>
          </div>
          <div class="service-option" @click="serviceType = 'repair'">
            <h3>Repair Request</h3>
            <p>Request a technician for an existing issue</p>
          </div>
          <div class="service-option emergency" @click="serviceType = 'emergency'">
            <h3>Emergency Service</h3>
            <p>Same-day service for urgent issues</p>
          </div>
        </div>
        
        <div v-if="serviceType" class="calendar-section">
          <h3>Select Available Time:</h3>
          <Calendar />
          <button class="request-btn" @click="requestService">Request {{ serviceTypeLabel }} Appointment</button>
        </div>
      </section>
    </div>
    
    <!-- Account Tab -->
    <div v-show="activeTab === 'account'" class="tab-content">
      <section class="account-section">
        <h2>Account Information</h2>
        <div class="account-details">
          <p><strong>Name:</strong> {{ user?.displayName || 'Not provided' }}</p>
          <p><strong>Email:</strong> {{ user?.email || 'Not provided' }}</p>
          <button class="edit-btn">Edit Profile</button>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
        
        <!-- Admin Tools Section - Added for Square Features Access -->
        <div v-if="isAdmin" class="admin-tools">
          <h3>Admin Tools</h3>
          <p>Access Square business management features:</p>
          <div class="admin-buttons">
            <router-link to="/customers" class="admin-btn customers">
              <span class="btn-icon">👥</span>Customers
            </router-link>
            <router-link to="/invoices" class="admin-btn invoices">
              <span class="btn-icon">📄</span>Invoices
            </router-link>
            <router-link to="/estimates" class="admin-btn estimates">
              <span class="btn-icon">📝</span>Estimates
            </router-link>
            <router-link to="/schedule" class="admin-btn schedule">
              <span class="btn-icon">📅</span>Schedule
            </router-link>
            <router-link to="/settings" class="admin-btn settings">
              <span class="btn-icon">⚙️</span>Settings
            </router-link>
          </div>
        </div>
        
        <h3>Billing History</h3>
        <table class="billing-history">
          <thead>
            <tr>
              <th>Date</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Apr 15, 2025</td>
              <td>Spring Maintenance</td>
              <td>$129.99</td>
              <td>Paid</td>
            </tr>
            <tr>
              <td>Feb 03, 2025</td>
              <td>Filter Replacement</td>
              <td>$49.99</td>
              <td>Paid</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
    
    <!-- Admin Tab - Direct access to Square features -->
    <div v-show="activeTab === 'admin'" class="tab-content">
      <section class="admin-section">
        <h2>Square Business Management</h2>
        <p>Access and manage your business operations:</p>
        
        <div class="admin-cards">
          <router-link to="/customers" class="admin-card">
            <div class="card-icon">👥</div>
            <h3>Customers</h3>
            <p>Manage customer records, view customer history and details</p>
          </router-link>
          
          <router-link to="/invoices" class="admin-card">
            <div class="card-icon">📄</div>
            <h3>Invoices</h3>
            <p>Create, view, and manage customer invoices</p>
          </router-link>
          
          <router-link to="/estimates" class="admin-card">
            <div class="card-icon">📝</div>
            <h3>Estimates</h3>
            <p>Create and manage estimates, convert to invoices</p>
          </router-link>
          
          <router-link to="/schedule" class="admin-card">
            <div class="card-icon">📅</div>
            <h3>Schedule</h3>
            <p>Manage appointments and service scheduling</p>
          </router-link>
          
          <router-link to="/settings" class="admin-card">
            <div class="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure Square API and business settings</p>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Calendar from '../components/Calendar.vue';
import EquipmentManager from '../components/EquipmentManager.vue';
import MaintenancePlans from '../components/MaintenancePlans.vue';
import { auth } from '../firebase';

const tabs = [
  { id: 'equipment', name: 'My Equipment' },
  { id: 'maintenance', name: 'Maintenance Plans' },
  { id: 'service', name: 'Request Service' },
  { id: 'account', name: 'Account' },
  // Added for direct access to Square Admin features
  { id: 'admin', name: 'Square Admin' }
];

const activeTab = ref('equipment');
const serviceType = ref('');
const user = ref(null); // In a real app, this would be populated from your auth system
const userId = ref('user123'); // Demo user ID, would come from authentication

// For demo purposes, making all users admins to access Square features
// In a real app, this would check user claims or roles from your auth system
const isAdmin = computed(() => {
  // Return true for this demo so everyone can access admin features
  // In production, you'd check: return user.value?.customClaims?.admin === true;
  return true;
});

// In a real app, monitor the authentication state
// onAuthStateChanged(auth, (currentUser) => {
//   user.value = currentUser;
// });

const serviceTypeLabel = computed(() => {
  switch (serviceType.value) {
    case 'standard': return 'Standard';
    case 'repair': return 'Repair';
    case 'emergency': return 'Emergency';
    default: return '';
  }
});

function openServiceScheduler(equipment) {
  activeTab.value = 'service';
  serviceType.value = 'standard';
  // In a real app, you might pre-select the equipment in the scheduler
}

function requestService() {
  alert(`Your ${serviceTypeLabel.value} service request has been submitted. A representative will contact you shortly to confirm.`);
  serviceType.value = '';
}

function logout() {
  // In a real app, sign out the user
  // auth.signOut();
  alert('Logged out successfully');
  // Redirect to home
  // $emit('goTo', 'home');
}
</script>

<style scoped>
.dashboard-page {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  color: #333; /* Add dark text color for white background */
}

.dashboard-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2rem;
  overflow-x: auto;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
}

.tab-btn.active {
  color: #3b5998;
  border-bottom-color: #3b5998;
}

.tab-content {
  min-height: 400px;
}

section {
  margin-bottom: 2rem;
}

.service-options {
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.service-option {
  background: #f9f9fb;
  padding: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  flex: 1;
  min-width: 200px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.service-option:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.service-option.emergency {
  background: #FFF3E0;
  border: 1px solid #FF9800;
}

.calendar-section {
  margin-top: 2rem;
}

.request-btn {
  background: #3b5998;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.account-details {
  background: #f9f9fb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.edit-btn, .logout-btn {
  background: #f1f1f1;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
}

.logout-btn {
  background: #ffebee;
  color: #d32f2f;
}

.billing-history {
  width: 100%;
  border-collapse: collapse;
}

.billing-history th, .billing-history td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.billing-history th {
  background: #f5f5f5;
  font-weight: 500;
}

/* Admin Tools Styling */
.admin-tools {
  background: #f0f2f8;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  border-left: 4px solid #3b5998;
}

.admin-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.admin-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.admin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.admin-btn.customers {
  border-left: 3px solid #4285F4;
}

.admin-btn.invoices {
  border-left: 3px solid #34A853;
}

.admin-btn.estimates {
  border-left: 3px solid #FBBC05;
}

.admin-btn.schedule {
  border-left: 3px solid #EA4335;
}

.admin-btn.settings {
  border-left: 3px solid #9c27b0;
}

.btn-icon {
  font-size: 1.2rem;
  margin-right: 0.25rem;
}

/* Admin Tab Section Styling */
.admin-section h2 {
  margin-bottom: 1rem;
  color: #3b5998;
}

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.admin-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 1.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  border-top: 5px solid #3b5998;
  display: flex;
  flex-direction: column;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.admin-card:nth-child(1) { border-top-color: #4285F4; }
.admin-card:nth-child(2) { border-top-color: #34A853; }
.admin-card:nth-child(3) { border-top-color: #FBBC05; }
.admin-card:nth-child(4) { border-top-color: #EA4335; }
.admin-card:nth-child(5) { border-top-color: #9c27b0; }

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.admin-card h3 {
  margin: 0.5rem 0;
  font-size: 1.25rem;
}

.admin-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Unified styles for backgrounds and text colors */
.admin-card, .account-details, .service-option, .admin-tools, .tab-content, .dashboard-page, .billing-history th, .billing-history td, .edit-btn, .logout-btn {
  background: rgba(255,255,255,0.85) !important;
  color: #222;
}
</style>
