<template>
  <div class="equipment-manager">
    <h2>My Equipment</h2>
    
    <div v-if="equipmentList.length === 0" class="no-equipment">
      <p>You haven't added any equipment yet.</p>
      <button @click="showAddForm = true" class="add-btn">Add Equipment</button>
    </div>
    
    <div v-else class="equipment-list">
      <div v-for="(item, index) in equipmentList" :key="index" class="equipment-card">
        <div class="equipment-info">
          <h3>{{ item.type }} - {{ item.brand }} {{ item.model }}</h3>
          <div class="equipment-details">
            <p><strong>Serial Number:</strong> {{ item.serial }}</p>
            <p><strong>Installation Date:</strong> {{ formatDate(item.installDate) }}</p>
            <p><strong>Warranty Until:</strong> {{ formatDate(item.warrantyEnd) }}</p>
            <div class="warranty-status" :class="{ expired: isWarrantyExpired(item.warrantyEnd) }">
              {{ isWarrantyExpired(item.warrantyEnd) ? 'Warranty Expired' : 'Under Warranty' }}
            </div>
          </div>
        </div>
        <div class="maintenance-info">
          <h4>Maintenance History</h4>
          <ul v-if="item.maintenanceHistory && item.maintenanceHistory.length">
            <li v-for="(record, i) in item.maintenanceHistory" :key="i">
              {{ formatDate(record.date) }} - {{ record.description }}
            </li>
          </ul>
          <p v-else>No maintenance history recorded</p>
          <p><strong>Next Service Due:</strong> {{ formatDate(item.nextServiceDate) }}</p>
          <button @click="scheduleService(item)" class="schedule-btn">Schedule Service</button>
        </div>
      </div>
      <button @click="showAddForm = true" class="add-btn">Add Another Equipment</button>
    </div>
    
    <div v-if="showAddForm" class="add-equipment-form">
      <h3>Add New Equipment</h3>
      <form @submit.prevent="addEquipment">
        <div class="form-row">
          <div class="form-group">
            <label>Equipment Type</label>
            <select v-model="newEquipment.type" required>
              <option value="Air Conditioner">Air Conditioner</option>
              <option value="Furnace">Furnace</option>
              <option value="Heat Pump">Heat Pump</option>
              <option value="Thermostat">Thermostat</option>
              <option value="Air Purifier">Air Purifier</option>
            </select>
          </div>
          <div class="form-group">
            <label>Brand</label>
            <input v-model="newEquipment.brand" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Model</label>
            <input v-model="newEquipment.model" required />
          </div>
          <div class="form-group">
            <label>Serial Number</label>
            <input v-model="newEquipment.serial" required />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Installation Date</label>
            <input type="date" v-model="newEquipment.installDate" required />
          </div>
          <div class="form-group">
            <label>Warranty End Date</label>
            <input type="date" v-model="newEquipment.warrantyEnd" required />
          </div>
        </div>
        <div class="form-buttons">
          <button type="button" @click="showAddForm = false" class="cancel-btn">Cancel</button>
          <button type="submit" class="submit-btn">Add Equipment</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  userId: String
});

const emit = defineEmits(['scheduleService']);

const showAddForm = ref(false);
const equipmentList = ref([
  {
    type: 'Air Conditioner',
    brand: 'Carrier',
    model: 'Infinity 19VS',
    serial: 'CA123456789',
    installDate: '2023-06-15',
    warrantyEnd: '2028-06-15',
    nextServiceDate: '2023-12-15',
    maintenanceHistory: [
      { date: '2023-06-15', description: 'Initial installation' }
    ]
  },
  {
    type: 'Furnace',
    brand: 'Trane',
    model: 'S9V2',
    serial: 'TR987654321',
    installDate: '2022-10-10',
    warrantyEnd: '2032-10-10',
    nextServiceDate: '2023-10-10',
    maintenanceHistory: [
      { date: '2022-10-10', description: 'Initial installation' },
      { date: '2023-03-15', description: 'Spring tune-up, filter replacement' }
    ]
  }
]);

// In a real app, this would load from your backend
// function loadEquipment() {
//   // API call to get equipment for props.userId
//   // equipmentList.value = response.data;
// }

const newEquipment = ref({
  type: 'Air Conditioner',
  brand: '',
  model: '',
  serial: '',
  installDate: '',
  warrantyEnd: '',
  nextServiceDate: '',
  maintenanceHistory: []
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function isWarrantyExpired(dateString) {
  return new Date(dateString) < new Date();
}

function addEquipment() {
  // Calculate next service date as 6 months from installation
  const installDate = new Date(newEquipment.value.installDate);
  const nextService = new Date(installDate);
  nextService.setMonth(nextService.getMonth() + 6);
  
  const equipment = {
    ...newEquipment.value,
    nextServiceDate: nextService.toISOString().split('T')[0],
    maintenanceHistory: [{
      date: newEquipment.value.installDate,
      description: 'Initial installation'
    }]
  };
  
  equipmentList.value.push(equipment);
  
  // Reset form
  newEquipment.value = {
    type: 'Air Conditioner',
    brand: '',
    model: '',
    serial: '',
    installDate: '',
    warrantyEnd: '',
    nextServiceDate: '',
    maintenanceHistory: []
  };
  showAddForm.value = false;
  
  // In a real app, this would save to your backend
  // saveEquipment(equipment);
}

function scheduleService(equipment) {
  emit('scheduleService', equipment);
}
</script>

<style scoped>
.equipment-manager {
  max-width: 900px;
  margin: 0 auto;
}

.equipment-card {
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: #333;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.equipment-info {
  flex: 1;
  min-width: 300px;
}

.maintenance-info {
  flex: 1;
  min-width: 300px;
}

.equipment-details {
  background: #f9f9fb;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.warranty-status {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  background: #4CAF50;
  color: white;
}

.warranty-status.expired {
  background: #f44336;
}

.add-equipment-form {
  background: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-top: 2rem;
  color: #333;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
}

.submit-btn, .add-btn, .schedule-btn {
  background: #3b5998;
  color: white;
}

button {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.add-btn {
  margin-top: 1rem;
}

.schedule-btn {
  margin-top: 1rem;
  background: #ff9100;
}

h3, h4 {
  margin-top: 0;
}

ul {
  padding-left: 1.5rem;
}
</style>
