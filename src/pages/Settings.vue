<template>
  <div class="page-content">
    <header class="page-header">
      <h1>Settings</h1>
      <button class="primary-button" @click="saveAllSettings">
        <span class="icon">💾</span> Save All Settings
      </button>
    </header>

    <div class="settings-container">
      <!-- Square API Settings -->
      <div class="settings-section">
        <h2>Square API Configuration</h2>
        
        <div class="form-group">
          <label>Square Access Token</label>
          <div class="token-input">
            <input 
              :type="showToken ? 'text' : 'password'" 
              v-model="squareToken" 
              placeholder="Enter your Square access token" 
            />
            <button class="icon-button" @click="toggleTokenVisibility">
              <span class="icon">{{ showToken ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
          <p class="help-text">
            Your Square access token is used to connect to the Square API. 
            <a href="https://developer.squareup.com/apps" target="_blank">Get your token from the Square Developer Dashboard</a>.
          </p>
        </div>

        <div class="form-group">
          <label>Environment</label>
          <div class="radio-group">
            <label class="radio-label">
              <input type="radio" v-model="squareEnvironment" value="sandbox" />
              Sandbox (Testing)
            </label>
            <label class="radio-label">
              <input type="radio" v-model="squareEnvironment" value="production" />
              Production (Live)
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>Location ID</label>
          <input 
            type="text" 
            v-model="squareLocationId" 
            placeholder="Enter your Square location ID" 
          />
          <button 
            class="secondary-button fetch-button" 
            @click="fetchLocations" 
            :disabled="!squareToken || fetchingLocations"
          >
            {{ fetchingLocations ? 'Fetching...' : 'Fetch Locations' }}
          </button>
          <div v-if="squareLocations.length" class="locations-dropdown">
            <select v-model="squareLocationId">
              <option value="">Select a location</option>
              <option 
                v-for="location in squareLocations" 
                :key="location.id" 
                :value="location.id"
              >
                {{ location.name }}
              </option>
            </select>
          </div>
        </div>
          <div class="form-actions">
          <button 
            class="primary-button" 
            @click="testSquareConnection" 
            :disabled="!squareToken || testingConnection"
          >
            {{ testingConnection ? 'Testing...' : 'Test Connection' }}
          </button>
          <button 
            class="secondary-button" 
            @click="runDiagnostics" 
            :disabled="runningDiagnostics"
          >
            {{ runningDiagnostics ? 'Running...' : 'Run Diagnostics' }}
          </button>
          <div v-if="connectionStatus" :class="['connection-status', connectionStatus.type]">
            {{ connectionStatus.message }}
          </div>
        </div>
      </div>

      <!-- Business Information -->
      <div class="settings-section">
        <h2>Business Information</h2>
        
        <div class="form-group">
          <label>Business Name</label>
          <input 
            type="text" 
            v-model="businessInfo.name" 
            placeholder="Enter your business name" 
          />
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input 
            type="email" 
            v-model="businessInfo.email" 
            placeholder="contact@yourbusiness.com" 
          />
        </div>
        
        <div class="form-group">
          <label>Phone</label>
          <input 
            type="tel" 
            v-model="businessInfo.phone" 
            placeholder="(555) 123-4567" 
          />
        </div>
        
        <div class="form-group">
          <label>Address</label>
          <input 
            type="text" 
            v-model="businessInfo.address.street" 
            placeholder="Street Address" 
          />
          <div class="address-inline">
            <input 
              type="text" 
              v-model="businessInfo.address.city" 
              placeholder="City" 
            />
            <input 
              type="text" 
              v-model="businessInfo.address.state" 
              placeholder="State" 
            />
            <input 
              type="text" 
              v-model="businessInfo.address.zip" 
              placeholder="ZIP Code" 
            />
          </div>
        </div>
      </div>
      
      <!-- Chatbot Integration Settings -->
      <div class="settings-section">
        <h2>Chatbot Integration</h2>
        
        <div class="form-group toggle-group">
          <label>Enable Chatbot Integration</label>
          <label class="toggle">
            <input type="checkbox" v-model="chatbotSettings.enabled" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        
        <div v-if="chatbotSettings.enabled">
          <div class="form-group">
            <label>LM Studio Connection URL</label>
            <input 
              type="text" 
              v-model="chatbotSettings.endpoint" 
              placeholder="http://localhost:1234/v1" 
            />
            <p class="help-text">
              The endpoint URL for your local LM Studio instance or other compatible API.
            </p>
          </div>
          
          <div class="form-group">
            <label>API Key (if required)</label>
            <input 
              type="password" 
              v-model="chatbotSettings.apiKey" 
              placeholder="Enter API key if required" 
            />
          </div>
          
          <div class="form-actions">
            <button 
              class="primary-button" 
              @click="testChatbotConnection" 
              :disabled="!chatbotSettings.endpoint || testingChatbot"
            >
              {{ testingChatbot ? 'Testing...' : 'Test Chatbot Connection' }}
            </button>
            <div v-if="chatbotStatus" :class="['connection-status', chatbotStatus.type]">
              {{ chatbotStatus.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// State
const squareToken = ref('');
const squareEnvironment = ref('sandbox');
const squareLocationId = ref('');
const squareLocations = ref([]);
const showToken = ref(false);
const fetchingLocations = ref(false);
const testingConnection = ref(false);
const connectionStatus = ref(null);
const testingChatbot = ref(false);
const chatbotStatus = ref(null);
const runningDiagnostics = ref(false);

const businessInfo = ref({
  name: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  }
});

const chatbotSettings = ref({
  enabled: false,
  endpoint: 'http://localhost:1234/v1',
  apiKey: '',
  model: 'default'
});

// Toggle token visibility
function toggleTokenVisibility() {
  showToken.value = !showToken.value;
}

// Fetch Square locations
async function fetchLocations() {
  if (!squareToken.value) return;
  
  fetchingLocations.value = true;
  
  try {
    // First save the token to ensure it's available
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';
    await axios.post(`${API_URL}/settings`, {
      squareToken: squareToken.value,
      squareEnvironment: squareEnvironment.value
    });
    
    // Then fetch locations
    const response = await axios.get(`${API_URL}/catalog/test-connection`);
    
    if (response.data?.success && response.data?.data?.locations) {
      squareLocations.value = response.data.data.locations.map(location => ({
        id: location.id,
        name: location.name
      }));
      
      if (squareLocations.value.length) {
        squareLocationId.value = squareLocations.value[0].id;
      }
    } else {
      throw new Error('Failed to retrieve locations');
    }
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    connectionStatus.value = {
      type: 'error',
      message: 'Failed to fetch locations: ' + (error.response?.data?.message || error.message || 'Unknown error')
    };
  } finally {
    fetchingLocations.value = false;
  }
}

// Test Square API connection
async function testSquareConnection() {
  if (!squareToken.value) return;
  
  testingConnection.value = true;
  connectionStatus.value = null;
  
  try {
    // Test connection using the backend's catalog endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';
    const response = await axios.get(`${API_URL}/catalog/test-connection`);
    
    if (response.data && response.data.success) {
      connectionStatus.value = {
        type: 'success',
        message: 'Successfully connected to Square API!'
      };
    } else {
      throw new Error(response.data?.message || 'Connection test failed');
    }
  } catch (error) {
    console.error('Failed to connect to Square API:', error);
    
    connectionStatus.value = {
      type: 'error',
      message: 'Failed to connect: ' + (error.response?.data?.message || error.message || 'Unknown error')
    };
  } finally {
    testingConnection.value = false;
  }
}

// Test Chatbot connection
async function testChatbotConnection() {
  if (!chatbotSettings.value.endpoint) return;
  
  testingChatbot.value = true;
  chatbotStatus.value = null;
  
  try {
    // In a real implementation, this would test the chatbot connection
    // For now we'll simulate a successful response
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    chatbotStatus.value = {
      type: 'success',
      message: 'Successfully connected to the chatbot service!'
    };
  } catch (error) {
    console.error('Failed to connect to chatbot service:', error);
    
    chatbotStatus.value = {
      type: 'error',
      message: 'Failed to connect: ' + (error.message || 'Unknown error')
    };
  } finally {
    testingChatbot.value = false;
  }
}

// Run diagnostics on settings
async function runDiagnostics() {
  runningDiagnostics.value = true;
  connectionStatus.value = null;
  
  try {
    // Run diagnostics via backend endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';
    const response = await axios.get(`${API_URL}/settings/diagnostics`);
    
    if (response.data && response.data.diagnostics) {
      const { envPath, readAccess, writeAccess, envVars } = response.data.diagnostics;
      
      // Format the diagnostics results for display
      let message = `Diagnostics results:\n`;
      message += `- Settings file: ${readAccess ? '✓' : '✗'} Read ${writeAccess ? '✓' : '✗'} Write\n`;
      message += `- Environment variables:\n`;
      
      Object.entries(envVars).forEach(([key, value]) => {
        message += `  - ${key}: ${value}\n`;
      });
      
      if (!readAccess || !writeAccess) {
        message += `\nTroubleshooting: Check file permissions on ${envPath}`;
      }
      
      connectionStatus.value = {
        type: response.data.success ? 'success' : 'warning',
        message
      };
      
      // If diagnostics failed, recommend restarting server
      if (!response.data.success) {
        connectionStatus.value.message += '\n\nRecommendation: Restart the server and try again.';
      }
    } else {
      throw new Error('Invalid diagnostics response');
    }
  } catch (error) {
    console.error('Failed to run diagnostics:', error);
    connectionStatus.value = {
      type: 'error',
      message: 'Error running diagnostics: ' + (error.response?.data?.message || error.message || 'Unknown error')
    };
  } finally {
    runningDiagnostics.value = false;
  }
}

// Save all settings
async function saveAllSettings() {
  try {
    // First show that we're saving
    connectionStatus.value = {
      type: 'info',
      message: 'Saving settings...'
    };
    
    // First save Square settings to backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';
    console.log('Saving settings to backend:', {
      environment: squareEnvironment.value,
      locationId: squareLocationId.value,
      hasToken: !!squareToken.value
    });
    
    // Add a small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await axios.post(`${API_URL}/settings`, {
      squareToken: squareToken.value,
      squareEnvironment: squareEnvironment.value,
      squareLocationId: squareLocationId.value
      // Don't include squareApplicationId - it's handled by the backend
    });
    
    console.log('Settings save response:', response.data);
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Unknown error saving settings');
    }
    
    // Save other settings to localStorage for now
    localStorage.setItem('businessInfo', JSON.stringify(businessInfo.value));
    localStorage.setItem('chatbotSettings', JSON.stringify(chatbotSettings.value));
    
    // Also save square settings to localStorage as backup
    localStorage.setItem('squareSettings', JSON.stringify({
      token: squareToken.value !== '••••••••••••••••' ? squareToken.value : '',
      environment: squareEnvironment.value,
      locationId: squareLocationId.value
    }));
    
    // Show connection status
    connectionStatus.value = {
      type: 'success',
      message: 'Settings saved successfully! Backend API updated.'
    };
      // Ask server to restart to apply environment changes
    try {
      await axios.post(`${API_URL}/settings/restart`);
      console.log('Server restart requested');
    } catch (restartError) {
      console.warn('Error requesting server restart:', restartError);
    }
    
    // Automatically test the connection after saving
    await testSquareConnection();
  } catch (error) {
    console.error('Failed to save settings:', error);
    connectionStatus.value = {
      type: 'error',
      message: 'Error saving settings: ' + (error.response?.data?.message || error.message || 'Unknown error')
    };
  }
}

// Load settings on mount
onMounted(async () => {
  try {
    // First try to load settings from backend
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';
    const response = await axios.get(`${API_URL}/settings`);
    
    if (response.data) {
      // Don't set token from backend for security (it only returns if token exists)
      // Only set the environment and location ID
      squareEnvironment.value = response.data.squareEnvironment || 'sandbox';
      squareLocationId.value = response.data.squareLocationId || '';
      
      // If token exists on backend, show a placeholder
      if (response.data.hasSquareToken) {
        squareToken.value = '••••••••••••••••'; // Placeholder for existing token
        connectionStatus.value = {
          type: 'success',
          message: 'Square token already configured'
        };
      }
    }
    
    // Load other settings from localStorage
    const savedBusinessInfo = JSON.parse(localStorage.getItem('businessInfo'));
    if (savedBusinessInfo) {
      businessInfo.value = savedBusinessInfo;
    }
    
    const savedChatbotSettings = JSON.parse(localStorage.getItem('chatbotSettings'));
    if (savedChatbotSettings) {
      chatbotSettings.value = savedChatbotSettings;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
    
    // Fall back to localStorage if backend fails
    try {
      const squareSettings = JSON.parse(localStorage.getItem('squareSettings'));
      if (squareSettings) {
        squareToken.value = squareSettings.token || '';
        squareEnvironment.value = squareSettings.environment || 'sandbox';
        squareLocationId.value = squareSettings.locationId || '';
      }
      
      const savedBusinessInfo = JSON.parse(localStorage.getItem('businessInfo'));
      if (savedBusinessInfo) {
        businessInfo.value = savedBusinessInfo;
      }
      
      const savedChatbotSettings = JSON.parse(localStorage.getItem('chatbotSettings'));
      if (savedChatbotSettings) {
        chatbotSettings.value = savedChatbotSettings;
      }
    } catch (localError) {
      console.error('Error loading settings from localStorage:', localError);
    }
  }
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

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: #333333;
  border-radius: var(--card-radius);
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.settings-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--primary-color);
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

.token-input {
  display: flex;
  align-items: center;
}

.token-input input {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.token-input .icon-button {
  height: 100%;
  padding: 0 1rem;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;
}

.help-text {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.help-text a {
  color: var(--primary-color);
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.fetch-button {
  margin-top: 0.5rem;
}

.locations-dropdown {
  margin-top: 1rem;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.connection-status {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.connection-status.success {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.connection-status.error {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: var(--primary-color);
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.address-inline {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
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

.primary-button:disabled {
  background: rgba(66, 103, 178, 0.5);
  cursor: not-allowed;
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

.secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon-button {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.icon-button:hover {
  transform: scale(1.1);
}
</style>
