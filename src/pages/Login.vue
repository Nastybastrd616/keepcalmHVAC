<template>
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <label>Email:<input v-model="email" type="email" required /></label><br />
      <label>Password:<input v-model="password" type="password" required /></label><br />
      <button type="submit">Login</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword, auth } from '../firebase';

const email = ref('');
const password = ref('');
const error = ref('');

async function login() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    error.value = '';
    // Optionally, redirect or set a logged-in state here
    alert('Login successful!');
  } catch (e) {
    error.value = e.message;
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.login-form label {
  display: block;
  margin-bottom: 1rem;
}
.error {
  color: #d32f2f;
  margin-top: 1rem;
}
</style>
