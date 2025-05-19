<template>
  <div class="price-card">
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <div class="details">
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <div class="price">{{ price }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  description: String,
  price: String
});
</script>

<style scoped>
.price-card {
  background: #fff;
  color: #222;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(59, 89, 152, 0.12);
  border: 1px solid rgba(59, 89, 152, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 260px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.price-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(59, 89, 152, 0.18);
}
.icon {
  font-size: 2.5rem;
  color: #3b5998;
}
.details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
}
.price {
  color: #ff9100;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}
</style>
