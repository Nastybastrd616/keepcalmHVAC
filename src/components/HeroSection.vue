<template>
  <section class="relative flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] px-4 py-12 sm:py-20 text-center overflow-hidden bg-gradient-to-br from-blue-200 via-pink-100 to-yellow-100">
    <div class="relative z-10 w-full max-w-3xl mx-auto">      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg animate-fade-in-up leading-tight">
        Welcome to <span class="text-blue-500">Keep Calm Heating and Cooling</span>
      </h1>
      <p class="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-gray-700 font-light animate-fade-in-up delay-200">
        Elevate your presence with creative solutions and a personal touch.
      </p>
      <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up delay-400">
        <button class="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition font-semibold text-base sm:text-lg">
          Get Started
        </button>
        <button class="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-500 border border-blue-500 rounded-full shadow hover:bg-blue-50 transition font-semibold text-base sm:text-lg">
          View Portfolio
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
// No script needed for static hero
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 1s cubic-bezier(0.23, 1, 0.32, 1) both;
}
.animate-fade-in-up.delay-200 {
  animation-delay: 0.2s;
}
.animate-fade-in-up.delay-400 {
  animation-delay: 0.4s;
}
</style>
