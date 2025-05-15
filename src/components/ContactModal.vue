<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Request a Quote</h2>
      <form @submit.prevent="submitForm">
        <label>Name:<input v-model="name" required /></label><br />
        <label>Email:<input v-model="email" type="email" required /></label><br />
        <label>Phone:<input v-model="phone" required /></label><br />
        <label>Message:<textarea v-model="message" required></textarea></label><br />
        <button type="submit">Send</button>
        <button type="button" @click="$emit('close')">Cancel</button>
      </form>
      <div v-if="submitted">Thank you! We'll contact you soon.</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')
const submitted = ref(false)
function submitForm() {
  submitted.value = true
}
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
.modal {
  background: #333333;
  color: rgba(255, 255, 255, 0.87);
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90vw;
}
</style>
