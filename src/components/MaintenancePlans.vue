<template>
  <div>
    <h2>Maintenance Plans</h2>
    
    <div class="plans-container">
      <div class="plan-card bronze">
        <h3>Bronze Plan</h3>
        <div class="plan-price">$149<span>/year</span></div>
        <ul class="plan-features">
          <li>1 annual maintenance visit</li>
          <li>10% discount on repairs</li>
          <li>Standard response time</li>
          <li>Email support</li>
        </ul>
        <button class="plan-button" @click="selectPlan('bronze')">Select Plan</button>
      </div>
      
      <div class="plan-card silver">
        <h3>Silver Plan</h3>
        <div class="plan-price">$249<span>/year</span></div>
        <ul class="plan-features">
          <li>2 annual maintenance visits</li>
          <li>15% discount on repairs</li>
          <li>Priority scheduling</li>
          <li>Phone and email support</li>
          <li>Filter replacement included</li>
        </ul>
        <div class="popular-tag">Most Popular</div>
        <button class="plan-button" @click="selectPlan('silver')">Select Plan</button>
      </div>
      
      <div class="plan-card gold">
        <h3>Gold Plan</h3>
        <div class="plan-price">$349<span>/year</span></div>
        <ul class="plan-features">
          <li>2 annual maintenance visits</li>
          <li>20% discount on repairs</li>
          <li>Same-day emergency service</li>
          <li>24/7 premium support</li>
          <li>Filter replacement included</li>
          <li>Extended parts warranty</li>
        </ul>
        <button class="plan-button" @click="selectPlan('gold')">Select Plan</button>
      </div>
    </div>
    
    <div v-if="selectedPlan" class="plan-signup">
      <h3>Sign up for {{ planTitle }}</h3>
      <form @submit.prevent="subscribeToPlan">
        <div class="form-group" v-if="!user">
          <p>Please <a href="#" @click.prevent="$emit('openLogin')">log in</a> or provide your information below:</p>
          <label>Name<input v-model="name" required /></label>
          <label>Email<input v-model="email" type="email" required /></label>
          <label>Phone<input v-model="phone" type="tel" required /></label>
        </div>
        <div class="form-group">
          <label>Address<input v-model="address" required /></label>
          <label>Payment Method
            <select v-model="paymentMethod" required>
              <option value="credit">Credit Card</option>
              <option value="invoice">Invoice Me</option>
            </select>
          </label>
        </div>
        <button type="submit" class="subscribe-btn">Subscribe Now</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { auth } from '../firebase';

const props = defineProps({
  user: Object
});

const selectedPlan = ref(null);
const name = ref('');
const email = ref('');
const phone = ref('');
const address = ref('');
const paymentMethod = ref('credit');

const planTitle = computed(() => {
  if (selectedPlan.value === 'bronze') return 'Bronze Plan';
  if (selectedPlan.value === 'silver') return 'Silver Plan';
  if (selectedPlan.value === 'gold') return 'Gold Plan';
  return '';
});

function selectPlan(plan) {
  selectedPlan.value = plan;
  
  // Pre-fill with user data if logged in
  if (props.user) {
    name.value = props.user.displayName || '';
    email.value = props.user.email || '';
  }
}

function subscribeToPlan() {
  // This would connect to a backend API
  alert(`Thank you for subscribing to the ${planTitle.value}! We'll contact you soon to finalize the details.`);
  // Reset form
  selectedPlan.value = null;
}
</script>

<style scoped>
.plans-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.plan-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(59, 89, 152, 0.15);
  border: 1px solid rgba(59, 89, 152, 0.1);
  padding: 2rem;
  width: 280px;
  position: relative;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(59, 89, 152, 0.2);
}

.plan-price {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b5998;
  margin: 1rem 0;
}

.plan-price span {
  font-size: 1rem;
  color: #666;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.plan-features li {
  padding: 0.5rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.plan-features li::before {
  content: "✓";
  color: #4CAF50;
  position: absolute;
  left: 0;
}

.plan-button {
  background: #3b5998;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.silver {
  border: 2px solid #c0c0c0;
  transform: scale(1.05);
}

.gold {
  border: 2px solid #ffd700;
}

.bronze {
  border: 2px solid #cd7f32;
}

.popular-tag {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #ff9100;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.plan-signup {
  background: rgba(255,255,255,0.85) !important;
  color: #222;
  padding: 2rem;
  border-radius: 1rem;
  margin: 2rem auto;
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 1rem;
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.25rem;
}

.subscribe-btn {
  background: #ff9100;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}
</style>
