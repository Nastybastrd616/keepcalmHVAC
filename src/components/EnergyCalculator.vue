<template>
  <div class="energy-efficiency">
    <h2>Energy Efficiency Calculator</h2>
    
    <div class="efficiency-form">
      <div class="form-section">
        <h3>Current System Information</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>System Type</label>
            <select v-model="currentSystem.type">
              <option value="central-ac">Central Air Conditioner</option>
              <option value="furnace">Furnace</option>
              <option value="heat-pump">Heat Pump</option>
              <option value="mini-split">Mini-Split System</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Approximate Age (years)</label>
            <select v-model="currentSystem.age">
              <option value="0-5">0-5</option>
              <option value="6-10">6-10</option>
              <option value="11-15">11-15</option>
              <option value="16-20">16-20</option>
              <option value="21+">21+</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label>Current SEER/AFUE Rating (if known)</label>
            <input type="number" v-model.number="currentSystem.rating" placeholder="e.g. 10" />
          </div>
          
          <div class="form-group">
            <label>Average Monthly Energy Bill ($)</label>
            <input type="number" v-model.number="monthlyBill" placeholder="e.g. 200" />
          </div>
        </div>
      </div>
      
      <div class="form-section">
        <h3>Home Information</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Home Size (sq ft)</label>
            <input type="number" v-model.number="home.size" placeholder="e.g. 2000" />
          </div>
          
          <div class="form-group">
            <label>Climate Zone</label>
            <select v-model="home.climateZone">
              <option value="hot">Hot (South)</option>
              <option value="mixed">Mixed (Mid-Atlantic/Midwest)</option>
              <option value="cold">Cold (North/Northeast)</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label>% of Energy Bill for Heating/Cooling</label>
          <div class="range-slider">
            <input 
              type="range" 
              min="10" 
              max="80" 
              step="5" 
              v-model.number="energyPercentage" 
            />
            <div class="range-value">{{ energyPercentage }}%</div>
          </div>
        </div>
      </div>
      
      <button @click="calculateSavings" class="calculate-btn">Calculate Potential Savings</button>
    </div>
    
    <div v-if="showResults" class="results-section">
      <h3>Potential Savings with a New System</h3>
      
      <div class="systems-comparison">
        <div class="comparison-card current">
          <h4>Current System</h4>
          <div class="rating">
            <div class="rating-value">{{ currentSystem.rating || 'Unknown' }}</div>
            <div class="rating-label">SEER/AFUE</div>
          </div>
          <div class="annual-cost">
            <div class="cost-value">${{ currentAnnualCost }}</div>
            <div class="cost-label">Annual Energy Cost</div>
          </div>
        </div>
        
        <div class="vs">VS</div>
        
        <div class="comparison-card new">
          <h4>High-Efficiency System</h4>
          <div class="rating">
            <div class="rating-value">{{ recommendedRating }}</div>
            <div class="rating-label">SEER/AFUE</div>
          </div>
          <div class="annual-cost">
            <div class="cost-value">${{ newAnnualCost }}</div>
            <div class="cost-label">Annual Energy Cost</div>
          </div>
        </div>
      </div>
      
      <div class="savings-summary">
        <div class="savings-card">
          <div class="savings-icon">💰</div>
          <div class="savings-value">${{ annualSavings }}</div>
          <div class="savings-label">Estimated Annual Savings</div>
        </div>
        
        <div class="savings-card">
          <div class="savings-icon">⏱️</div>
          <div class="savings-value">{{ paybackPeriod }} years</div>
          <div class="savings-label">Estimated Payback Period</div>
        </div>
        
        <div class="savings-card">
          <div class="savings-icon">🌍</div>
          <div class="savings-value">{{ co2Reduction }} lbs</div>
          <div class="savings-label">Annual CO₂ Reduction</div>
        </div>
      </div>
      
      <div class="rebates-section">
        <h4>Available Rebates & Incentives</h4>
        <ul class="rebates-list">
          <li v-for="(rebate, index) in availableRebates" :key="index">
            <div class="rebate-name">{{ rebate.name }}</div>
            <div class="rebate-amount">{{ rebate.amount }}</div>
          </li>
        </ul>
        <p class="rebate-note">* Rebate availability varies by location and is subject to change.</p>
      </div>
      
      <div class="call-to-action">
        <p>Ready to upgrade and start saving? Our experts can help you choose the right system for your home.</p>
        <button @click="$emit('requestConsultation')" class="cta-btn">Request a Free Consultation</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentSystem = ref({
  type: 'central-ac',
  age: '11-15',
  rating: null
});

const monthlyBill = ref(null);
const energyPercentage = ref(50);
const showResults = ref(false);

const home = ref({
  size: null,
  climateZone: 'mixed'
});

// Calculate baseline current system rating if not provided
const estimatedCurrentRating = computed(() => {
  if (currentSystem.value.rating) return currentSystem.value.rating;
  
  // Default ratings by age
  switch (currentSystem.value.type) {
    case 'central-ac':
    case 'mini-split':
      switch (currentSystem.value.age) {
        case '0-5': return 14;
        case '6-10': return 13;
        case '11-15': return 11;
        case '16-20': return 10;
        default: return 8;
      }
    case 'heat-pump':
      switch (currentSystem.value.age) {
        case '0-5': return 15;
        case '6-10': return 14;
        case '11-15': return 12;
        case '16-20': return 10;
        default: return 8;
      }
    case 'furnace':
      switch (currentSystem.value.age) {
        case '0-5': return 90;
        case '6-10': return 85;
        case '11-15': return 80;
        case '16-20': return 75;
        default: return 65;
      }
    default:
      return 10;
  }
});

// Recommended ratings for new systems
const recommendedRating = computed(() => {
  switch (currentSystem.value.type) {
    case 'central-ac':
      return 18;
    case 'heat-pump':
      return 20;
    case 'mini-split':
      return 22;
    case 'furnace':
      return 96;
    default:
      return 18;
  }
});

// Calculated results
const currentAnnualCost = ref(0);
const newAnnualCost = ref(0);
const annualSavings = ref(0);
const paybackPeriod = ref(0);
const co2Reduction = ref(0);
const availableRebates = ref([]);

function calculateSavings() {
  if (!monthlyBill.value || !home.value.size) {
    alert('Please fill out all required fields');
    return;
  }
  
  // Calculate annual energy costs
  const annualBill = monthlyBill.value * 12;
  const heatingCoolingCost = annualBill * (energyPercentage.value / 100);
  
  currentAnnualCost.value = Math.round(heatingCoolingCost);
  
  // Calculate efficiency improvement factor
  let efficiencyImprovement;
  if (currentSystem.value.type === 'furnace') {
    // For furnaces, higher AFUE is better
    efficiencyImprovement = recommendedRating.value / estimatedCurrentRating.value;
  } else {
    // For AC and heat pumps, higher SEER is better
    efficiencyImprovement = recommendedRating.value / estimatedCurrentRating.value;
  }
  
  // Estimate new annual cost
  newAnnualCost.value = Math.round(currentAnnualCost.value / efficiencyImprovement);
  
  // Calculate annual savings
  annualSavings.value = Math.round(currentAnnualCost.value - newAnnualCost.value);
  
  // Estimate system cost based on home size
  const systemCost = estimateSystemCost();
  
  // Calculate payback period
  paybackPeriod.value = Math.round((systemCost / annualSavings.value) * 10) / 10;
  
  // Calculate CO2 reduction (rough estimate)
  // Average home produces about 1.5 pounds of CO2 per kWh
  // Assuming 12,000 kWh average annual usage for AC/heating
  const energySavingsPercent = 1 - (1 / efficiencyImprovement);
  co2Reduction.value = Math.round(12000 * 1.5 * energySavingsPercent);
  
  // Get available rebates
  availableRebates.value = getAvailableRebates();
  
  showResults.value = true;
}

function estimateSystemCost() {
  const baseCost = {
    'central-ac': 5000,
    'heat-pump': 6500,
    'furnace': 4000,
    'mini-split': 4000
  }[currentSystem.value.type] || 5000;
  
  // Adjust for home size
  let sizeFactor = 1;
  if (home.value.size < 1500) sizeFactor = 0.8;
  else if (home.value.size > 3000) sizeFactor = 1.3;
  
  return baseCost * sizeFactor;
}

function getAvailableRebates() {
  // In a real app, this would come from a database or API based on location
  // These are just sample rebates
  return [
    {
      name: 'Federal Tax Credit (30%)',
      amount: 'Up to $1,200'
    },
    {
      name: 'Utility Company Rebate',
      amount: '$500 - $1,000'
    },
    {
      name: 'Manufacturer Rebate',
      amount: '$300 - $500'
    }
  ];
}
</script>

<style scoped>
.energy-efficiency {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  margin-top: 0;
  color: #3b5998;
}

.efficiency-form {
  margin: 2rem 0;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9f9fb;
  border-radius: 8px;
}

h3 {
  margin-top: 0;
  color: #3b5998;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.form-group {
  margin-bottom: 1.5rem;
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
  font-size: 1rem;
}

.range-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.range-slider input {
  flex: 1;
}

.range-value {
  font-weight: bold;
  width: 3rem;
}

.calculate-btn {
  background: #3b5998;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1rem;
  width: 100%;
}

.results-section {
  margin-top: 3rem;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.systems-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.comparison-card {
  background: #fff;
  color: #222;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  flex: 1;
  min-width: 250px;
}

.comparison-card.current {
  border: 2px solid #e0e0e0;
}

.comparison-card.new {
  border: 2px solid #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
}

.rating {
  margin: 1.5rem 0;
}

.rating-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b5998;
}

.annual-cost {
  padding: 1rem;
  border-radius: 4px;
}

.cost-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.comparison-card.current .cost-value {
  color: #F44336;
}

.comparison-card.new .cost-value {
  color: #4CAF50;
}

.vs {
  font-weight: bold;
  font-size: 1.5rem;
  color: #666;
}

.savings-summary {
  display: flex;
  gap: 2rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.savings-card {
  background: #f9f9fb;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  flex: 1;
  min-width: 200px;
}

.savings-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.savings-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3b5998;
  margin: 0.5rem 0;
}

.rebates-section {
  background: #EDE7F6;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.rebates-list {
  list-style: none;
  padding: 0;
}

.rebates-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.1);
}

.rebate-amount {
  font-weight: bold;
}

.rebate-note {
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
}

.call-to-action {
  text-align: center;
  margin-top: 2rem;
  padding: 2rem;
  background: #E3F2FD;
  border-radius: 8px;
}

.cta-btn {
  background: #ff9100;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 1.1rem;
  margin-top: 1rem;
}
</style>
