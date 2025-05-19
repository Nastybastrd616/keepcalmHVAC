<template>
  <header class="w-full py-6 px-4 bg-white/80 backdrop-blur shadow-sm sticky top-0 z-30">    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">        <img src="/thermometer-logo.svg" alt="Keep Calm HVAC Logo" class="w-16 h-16" />
        <span class="font-bold text-2xl text-gray-800">Keep Calm Heating and Cooling</span>
      </div>
      <nav class="hidden md:flex gap-8 text-gray-700 font-medium">
        <a href="#" class="hover:text-blue-500 transition">Home</a>
        <a href="#about" class="hover:text-blue-500 transition">About</a>
        <a href="#services" class="hover:text-blue-500 transition">Services</a>
        <a href="#contact" class="hover:text-blue-500 transition">Contact</a>
        <router-link v-if="isAdmin" to="/admin" class="admin-dashboard-btn">Admin Dashboard</router-link>
      </nav>
      <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition" @click="open = !open">
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    <transition name="slide-fade">      <nav v-if="open" class="md:hidden flex flex-col gap-4 mt-4 text-gray-700 font-medium bg-white rounded-xl shadow p-6">
        <a href="#" class="hover:text-blue-500 transition">Home</a>
        <a href="#about" class="hover:text-blue-500 transition">About</a>
        <a href="#services" class="hover:text-blue-500 transition">Services</a>
        <a href="#contact" class="hover:text-blue-500 transition">Contact</a>
        <router-link v-if="isAdmin" to="/admin" class="admin-dashboard-btn-mobile">Admin Dashboard</router-link>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth, onAuthStateChanged } from '../firebase'

const open = ref(false)
const router = useRouter()
const user = ref(null)

// Track user authentication state
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser
})

// Check if user is admin
const isAdmin = computed(() => {
  return user.value && (user.value.isAdmin === true || user.value.email === 'admin@example.com')
})
</script>

<style scoped>
header, nav {
  background: #fff;
  color: #222;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.admin-dashboard-btn {
  background: #ff9100;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.admin-dashboard-btn:hover {
  background: #ff7300;
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  color: #fff;
}

.admin-dashboard-btn-mobile {
  background: #ff9100;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-align: center;
  margin-top: 8px;
  display: block;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.admin-dashboard-btn-mobile:hover {
  background: #ff7300;
  color: #fff;
}
</style>
