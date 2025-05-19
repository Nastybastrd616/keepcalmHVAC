<template>
  <AdminLayout>
    <div class="page-content">
      <h1>Database Viewer & Export</h1>
      <div class="db-list">
        <label>Select DB File:</label>
        <select v-model="selectedFile" @change="loadDb">
          <option v-for="file in dbFiles" :key="file" :value="file">{{ file }}</option>
        </select>
        <button class="primary-button" @click="exportDb" :disabled="!selectedFile">Export as JSON</button>
      </div>
      <div v-if="dbData" class="db-table-container">
        <pre class="db-json">{{ formattedDbData }}</pre>
        <button class="secondary-button" @click="testIntegrity">Test Integrity</button>
        <div v-if="integrityResult" class="integrity-result">
          <span :class="integrityResult.valid ? 'valid' : 'invalid'">
            {{ integrityResult.message }}
          </span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminLayout from '../layouts/AdminLayout.vue';

const dbFiles = [
  'customers.json',
  'invoices.json',
  'estimates.json',
  'schedule.json',
  'system_metadata.json',
  'chatbot_history.json',
  'system_logs.json'
];

const selectedFile = ref('customers.json');
const dbData = ref(null);
const integrityResult = ref(null);

function loadDb() {
  fetch(`/backend/data/${selectedFile.value}`)
    .then(res => res.json())
    .then(data => {
      dbData.value = data;
      integrityResult.value = null;
    });
}

function exportDb() {
  const blob = new Blob([JSON.stringify(dbData.value, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = selectedFile.value;
  a.click();
  URL.revokeObjectURL(url);
}

function testIntegrity() {
  // Simple integrity check: valid JSON, not empty, no duplicate IDs (if array)
  if (!dbData.value) {
    integrityResult.value = { valid: false, message: 'No data loaded.' };
    return;
  }
  if (Array.isArray(dbData.value)) {
    const ids = dbData.value.map(x => x.id).filter(Boolean);
    const hasDupes = new Set(ids).size !== ids.length;
    if (hasDupes) {
      integrityResult.value = { valid: false, message: 'Duplicate IDs found.' };
      return;
    }
    integrityResult.value = { valid: true, message: 'No duplicate IDs. Data looks good.' };
  } else {
    integrityResult.value = { valid: true, message: 'Data loaded. (Not an array)' };
  }
}

const formattedDbData = computed(() =>
  dbData.value ? JSON.stringify(dbData.value, null, 2) : ''
);

onMounted(loadDb);
</script>

<style scoped>
.page-content {
  background: #fff;
  color: #222;
  padding: 2rem;
}
.db-list {
  margin-bottom: 2rem;
}
.db-table-container {
  margin-top: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.5rem;
}
.db-json {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 1rem;
  font-size: 0.95rem;
  max-height: 400px;
  overflow: auto;
  color: #222;
}
.integrity-result {
  margin-top: 1rem;
}
.valid {
  color: #2e7d32;
  font-weight: bold;
}
.invalid {
  color: #c62828;
  font-weight: bold;
}
</style>
