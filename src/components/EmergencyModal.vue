<template>
  <div class="modal-backdrop" v-if="show" @click.self="$emit('close')">
    <div class="modal-container emergency-modal">
      <div class="modal-header">
        <div class="emergency-header">
          <span class="emergency-icon">🚨</span>
          <h2>Emergency Service Request</h2>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>
      
      <div class="modal-body">
        <p class="emergency-subtitle">Select an option below to get help quickly:</p>
        
        <div class="options-container">
          <button class="option-btn new-customer-btn" @click="selectOption('new')">
            <span class="option-icon">👋</span>
            <div class="option-text">
              <h3>New Customer</h3>
              <p>First time using our service</p>
            </div>
          </button>
          
          <button class="option-btn existing-customer-btn" @click="selectOption('existing')">
            <span class="option-icon">👤</span>
            <div class="option-text">
              <h3>Existing Customer</h3>
              <p>You've used our service before</p>
            </div>
          </button>
          
          <button class="option-btn question-btn" @click="selectOption('question')">
            <span class="option-icon">❓</span>
            <div class="option-text">
              <h3>I Have a Question</h3>
              <p>Need information before proceeding</p>
            </div>
          </button>
        </div>
        
        <p class="emergency-note">For life-threatening emergencies, please call 911</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['close', 'optionSelected']);

function selectOption(type) {
  emits('optionSelected', type);
  emits('close');
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(3px);
}

.modal-container {
  width: 90%;
  max-width: 550px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  animation: modal-appear 0.3s ease;
}

.emergency-modal {
  border: 4px solid #d9261c;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(90deg, #d9261c 0%, #ff4b40 100%);
  color: white;
}

.emergency-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.emergency-icon {
  font-size: 1.5rem;
  animation: pulse 2s infinite;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  margin: 0;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.2);
}

.modal-body {
  padding: 1.5rem;
  background-color: white;
  color: #333;
}

.emergency-subtitle {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.option-btn {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background-color: white;
  transition: all 0.2s;
  cursor: pointer;
  text-align: left;
}

.option-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.new-customer-btn:hover {
  border-color: #4caf50;
  background-color: #f1f8e9;
}

.existing-customer-btn:hover {
  border-color: #2196f3;
  background-color: #e3f2fd;
}

.question-btn:hover {
  border-color: #ff9800;
  background-color: #fff8e1;
}

.option-icon {
  font-size: 1.8rem;
  margin-right: 1rem;
}

.option-text {
  flex: 1;
}

.option-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.option-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.emergency-note {
  text-align: center;
  font-size: 0.85rem;
  color: #d9261c;
  margin-top: 1rem;
  font-style: italic;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}

@media (max-width: 576px) {
  .modal-container {
    width: 95%;
    max-width: 100%;
    margin: 0 10px;
  }
  
  .modal-header {
    padding: 0.8rem;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .option-icon {
    font-size: 1.5rem;
    margin-right: 0.8rem;
  }
}
</style>
