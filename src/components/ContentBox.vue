<template>
  <div class="content-box" :class="{ 'with-hover': hover }">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  hover: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.content-box {
  background: rgba(255,255,255,0.85) !important;
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  border: var(--card-border);
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #222;
}

.content-box.with-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 89, 152, 0.18);
}
</style>
