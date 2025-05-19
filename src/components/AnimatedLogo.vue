<template>
  <div class="animated-logo">
    <span class="logo-keep">
      <span class="snow-container">
        <span v-for="n in snowflakes" :key="n" class="snowflake">❄</span>
      </span>
      Keep
    </span>
    <span class="logo-calm-container">
      <span class="logo-calm">Calm</span>
    </span>
    <span class="logo-hvac">HVAC</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const snowflakes = 12
const flamesCount = 8

// Animate snowflakes
onMounted(() => {
  // No JS needed for basic snow animation, handled by CSS
})
</script>

<style scoped>
.animated-logo {
  display: flex;
  align-items: center;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 2.1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  position: relative;
  user-select: none;
}
.logo-keep {
  position: relative;
  color: #fff;
  text-shadow: 0 2px 8px #314a86, 0 0 2px #000, 0 0 8px #ff9100, 0 0 16px #fff;
  margin-right: 0.25em;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
}
.snow-container {
  position: absolute;
  left: 0;
  bottom: -1.1em;
  width: 100%;
  height: 1.2em;
  pointer-events: none;
  z-index: 3;
  display: flex;
  justify-content: center;
}
.snowflake {
  position: relative;
  color: #b3e0ff;
  font-size: 0.22em;
  opacity: 0.85;
  animation: snow-fall 2.5s linear infinite;
  margin: 0 0.08em;
}
.snowflake:nth-child(1) { animation-delay: 0s;   top: 0.1em; }
.snowflake:nth-child(2) { animation-delay: 0.3s; top: 0.3em; }
.snowflake:nth-child(3) { animation-delay: 0.6s; top: 0.15em; }
.snowflake:nth-child(4) { animation-delay: 0.9s; top: 0.4em; }
.snowflake:nth-child(5) { animation-delay: 0.2s; top: 0.05em; }
.snowflake:nth-child(6) { animation-delay: 0.5s; top: 0.25em; }
.snowflake:nth-child(7) { animation-delay: 0.8s; top: 0.35em; }
.snowflake:nth-child(8) { animation-delay: 0.1s; top: 0.2em; }
.snowflake:nth-child(9) { animation-delay: 0.4s; top: 0.28em; }
.snowflake:nth-child(10) { animation-delay: 0.7s; top: 0.12em; }
.snowflake:nth-child(11) { animation-delay: 0.15s; top: 0.32em; }
.snowflake:nth-child(12) { animation-delay: 0.55s; top: 0.18em; }
@keyframes snow-fall {
  0% { top: -0.2em; opacity: 0.9; }
  80% { opacity: 0.85; }
  100% { top: 1.2em; opacity: 0; }
}
.logo-calm-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 0.25em;
}
.logo-calm {
  color: #fff;
  text-shadow: 0 2px 8px #d9261c, 0 0 2px #000, 0 0 8px #ff9100, 0 0 16px #fff;
  position: relative;
  z-index: 2;
  font-weight: 900;
  letter-spacing: 0.03em;
}
.flames, .flame-emoji, .flame {
  display: none !important;
}
.logo-hvac {
  color: #314a86;
  font-size: 1.1rem;
  font-weight: 600;
  margin-left: 0.3em;
  letter-spacing: 0.01em;
  opacity: 0.85;
}
</style>
