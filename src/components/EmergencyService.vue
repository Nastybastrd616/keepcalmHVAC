<template>
  <div class="emergency-service">
    <div v-if="!submitted" class="emergency-request">
      <h2>Emergency Service Request</h2>
      <p class="emergency-notice">For urgent HVAC issues requiring immediate attention</p>
      
      <div class="importance-notice">
        <div class="icon">⚠️</div>
        <div class="message">
          <strong>Response time: 2-4 hours</strong>
          <p>A technician will contact you as soon as possible to schedule an immediate visit.</p>
        </div>
      </div>
      
      <form @submit.prevent="submitRequest">
        <div class="form-row">
          <div class="form-group">
            <label>Name</label>
            <input v-model="name" required />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="phone" type="tel" required />
          </div>
        </div>
        
        <div class="form-group">
          <label>Address</label>
          <input v-model="address" required />
        </div>
        
        <div class="form-group">
          <label>Type of Issue</label>
          <select v-model="issueType" required>
            <option value="">-- Select Issue Type --</option>
            <option value="no-cooling">No Cooling</option>
            <option value="no-heating">No Heating</option>
            <option value="water-leak">Water Leak</option>
            <option value="strange-noise">Unusual Noise</option>
            <option value="burning-smell">Burning Smell</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div v-if="issueType === 'other'" class="form-group">
          <label>Describe Issue</label>
          <textarea v-model="issueDescription" required></textarea>
        </div>
        
        <div class="form-group">
          <label>Additional Information</label>
          <textarea v-model="additionalInfo" placeholder="Any details that may help our technician prepare for your emergency..."></textarea>
        </div>
        
        <div class="contact-preference">
          <p><strong>Preferred Contact Method</strong></p>
          <label>
            <input type="radio" v-model="contactMethod" value="phone" checked />
            Phone
          </label>
          <label>
            <input type="radio" v-model="contactMethod" value="text" />
            Text Message
          </label>
        </div>
        
        <div class="consent-check">
          <label>
            <input type="checkbox" v-model="understands" required />
            I understand that emergency service requests may incur additional fees
          </label>
        </div>
        
        <button type="submit" class="submit-btn">Submit Emergency Request</button>
      </form>
    </div>
    
    <div v-else class="confirmation">
      <div class="success-icon">✓</div>
      <h2>Emergency Request Received</h2>
      <p>Thank you for your emergency service request. One of our technicians will contact you within the next 2-4 hours.</p>
      <p><strong>Request ID:</strong> {{ requestId }}</p>
      <p class="contact-info">If you need immediate assistance, please call our emergency hotline: <strong>(555) 123-4567</strong></p>
      <button @click="resetForm" class="reset-btn">Submit Another Request</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Form fields
const name = ref('');
const phone = ref('');
const address = ref('');
const issueType = ref('');
const issueDescription = ref('');
const additionalInfo = ref('');
const contactMethod = ref('phone');
const understands = ref(false);

// Submission status
const submitted = ref(false);
const requestId = ref('');

function submitRequest() {
  // Generate a random request ID
  const id = 'EM' + Date.now().toString().slice(-8);
  requestId.value = id;
  
  // In a real app, this would send the request to a backend API
  console.log('Emergency request submitted:', {
    name: name.value,
    phone: phone.value,
    address: address.value,
    issueType: issueType.value,
    issueDescription: issueDescription.value,
    additionalInfo: additionalInfo.value,
    contactMethod: contactMethod.value,
    requestId: requestId.value,
  });
  
  // Show confirmation
  submitted.value = true;
  
  // In a real app, you might also:
  // 1. Send an SMS to the customer with the request ID
  // 2. Notify the on-call technician
  // 3. Update the customer's account with the request
}

function resetForm() {
  // Reset form for a new request
  name.value = '';
  phone.value = '';
  address.value = '';
  issueType.value = '';
  issueDescription.value = '';
  additionalInfo.value = '';
  contactMethod.value = 'phone';
  understands.value = false;
  submitted.value = false;
  requestId.value = '';
}
</script>

<style scoped>
.emergency-service {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  color: #d32f2f;
  margin-top: 0;
}

.emergency-notice {
  color: #555;
  font-style: italic;
  margin-bottom: 1.5rem;
}

.importance-notice {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #FFF8E1;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #FFC107;
}

.icon {
  font-size: 2rem;
}

.message p {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-group {
  margin-bottom: 1rem;
  flex: 1;
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.contact-preference {
  margin: 1.5rem 0;
}

.contact-preference label {
  display: inline-flex;
  align-items: center;
  margin-right: 1.5rem;
}

.contact-preference input {
  width: auto;
  margin-right: 0.5rem;
}

.consent-check {
  margin: 1.5rem 0;
}

.consent-check label {
  display: flex;
  align-items: center;
  font-weight: normal;
}

.consent-check input {
  width: auto;
  margin-right: 0.5rem;
}

.submit-btn {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  font-size: 1.1rem;
}

.confirmation {
  text-align: center;
  padding: 2rem 0;
}

.success-icon {
  font-size: 4rem;
  color: #4CAF50;
  background: #E8F5E9;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
}

.contact-info {
  background: #E0F7FA;
  padding: 1rem;
  border-radius: 4px;
  margin: 2rem 0;
}

.reset-btn {
  background: #f1f1f1;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}
</style>
