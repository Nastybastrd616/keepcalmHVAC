<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <slot />
      <button @click="$emit('close')">Close</button>
    </div>
  </div>
</template>

<script setup>
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
  padding: 2rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.87); /* Ensure text is visible */
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
