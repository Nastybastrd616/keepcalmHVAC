<template>
  <div>
    <h1>Contact Us</h1>
    <p>Have questions or need a quote? Fill out the form below and our team will get back to you soon.</p>
    <form @submit.prevent="submitForm" class="contact-form">
      <label>Name:<input v-model="name" required /></label><br />
      <label>Email:<input v-model="email" type="email" required /></label><br />
      <label>Message:<textarea v-model="message" required></textarea></label><br />
      <button type="submit">Send</button>
    </form>
    <div v-if="submitted">Thank you! We'll be in touch soon.</div>
    <div class="contact-details">
      <h2>Business Hours</h2>
      <ul>
        <li>Mon–Fri: 8:00am – 6:00pm</li>
        <li>Sat: 9:00am – 2:00pm</li>
        <li>Sun: Closed</li>
      </ul>
      <h2>Our Location</h2>
      <iframe
        class="map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019123456789!2d-122.419415484681!3d37.7749297797596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c5b0b0b0b%3A0x0!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus"
        width="100%" height="220" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)
function submitForm() {
  submitted.value = true
}
</script>

<style scoped>
.contact-form, .contact-details {
  background: #fff;
  color: #222;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--card-shadow);
  border: var(--card-border);
}

.contact-details {
  margin-top: 2rem;
  padding: 1.5rem;
}

.map {
  border-radius: 1rem;
  margin-top: 1rem;
}

label {
  color: #222;
  margin-bottom: 0.5rem;
  display: block;
}

input, textarea {
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.75rem;
  background: #fff;
  color: #222;
}

input:focus, textarea:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(255, 145, 0, 0.2);
  outline: none;
}

button[type="submit"] {
  background: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  transition: background 0.2s;
}

button[type="submit"]:hover {
  background: #4d6bb3;
}
</style>
