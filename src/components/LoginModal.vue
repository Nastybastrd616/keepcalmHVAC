<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Customer Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="your@email.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="••••••••"
            required
          />
        </div>
        <div v-if="error" class="error">{{ error }}</div>
        <div class="buttons">
          <button type="button" @click="$emit('close')" class="cancel-btn">Cancel</button>
          <button type="submit" class="login-btn">Log In</button>
        </div>
        <div class="register">
          <p>New customer? <a href="#" @click.prevent="showRegister = true">Create an account</a></p>
        </div>
      </form>

      <div v-if="showRegister" class="register-form">
        <h3>Create New Account</h3>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="newEmail">Email</label>
            <input 
              id="newEmail"
              v-model="newEmail" 
              type="email" 
              placeholder="your@email.com"
              required
            />
          </div>
          <div class="form-group">
            <label for="newPassword">Password</label>
            <input 
              id="newPassword"
              v-model="newPassword" 
              type="password" 
              placeholder="••••••••"
              required
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              v-model="confirmPassword" 
              type="password" 
              placeholder="••••••••"
              required
            />
          </div>
          <div v-if="registerError" class="error">{{ registerError }}</div>
          <button type="submit" class="register-btn">Create Account</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';
import { auth } from '../firebase';

// Define emits
const emit = defineEmits(['close', 'loginSuccess']);

// Login form
const email = ref('');
const password = ref('');
const error = ref('');

// Register form
const showRegister = ref(false);
const newEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const registerError = ref('');

async function login() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    error.value = '';
    // If successful, close the modal and possibly redirect    alert('Login successful!');
    emit('close');
    emit('loginSuccess');
  } catch (e) {
    error.value = e.message || 'Login failed. Please check your credentials.';
  }
}

async function register() {
  if (newPassword.value !== confirmPassword.value) {
    registerError.value = 'Passwords do not match';
    return;
  }
  
  try {
    await createUserWithEmailAndPassword(auth, newEmail.value, newPassword.value);
    registerError.value = '';
    // If successful, switch back to login form or close modal    alert('Account created successfully! Please log in.');
    showRegister.value = false;
    newEmail.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    emit('loginSuccess');
  } catch (e) {
    registerError.value = e.message || 'Registration failed. Please try again.';
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: #fff;
  color: #222;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
}

h2 {
  margin-top: 0;
  color: #3b5998;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.login-btn, .register-btn {
  background: #3b5998;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.error {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.register {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.register a {
  color: #3b5998;
  text-decoration: none;
  font-weight: 500;
}

.register-form {
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

h3 {
  margin-top: 0;
  color: #3b5998;
  font-size: 1.25rem;
}
</style>
