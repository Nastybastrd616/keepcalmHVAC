<template>
  <header class="w-full py-6 px-4 bg-white/80 backdrop-blur shadow-sm sticky top-0 z-30">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">        <img src="/thermometer-logo.svg" alt="Keep Calm HVAC Logo" class="w-16 h-16" />
        <span class="font-bold text-2xl text-gray-800">Keep Calm Heating and Cooling</span>
      </div>
      <nav class="hidden md:flex gap-8 text-gray-700 font-medium">
        <a href="#" class="hover:text-blue-500 transition">Home</a>
        <a href="#about" class="hover:text-blue-500 transition">About</a>
        <a href="#services" class="hover:text-blue-500 transition">Services</a>
        <a href="#contact" class="hover:text-blue-500 transition">Contact</a>
      </nav>
      <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition" @click="open = !open">
        <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>
    <transition name="slide-fade">
      <nav v-if="open" class="md:hidden flex flex-col gap-4 mt-4 text-gray-700 font-medium bg-white rounded-xl shadow p-6">
        <a href="#" class="hover:text-blue-500 transition">Home</a>
        <a href="#about" class="hover:text-blue-500 transition">About</a>
        <a href="#services" class="hover:text-blue-500 transition">Services</a>
        <a href="#contact" class="hover:text-blue-500 transition">Contact</a>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
