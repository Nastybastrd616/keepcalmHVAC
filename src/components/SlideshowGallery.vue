<template>
  <div class="slideshow-gallery">
    <img :src="images[current]" class="slideshow-image" alt="Slideshow image" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  interval: {
    type: Number,
    default: 4000 // 4 seconds
  }
});

const current = ref(0);
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % props.images.length;
  }, props.interval);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.slideshow-gallery {
  width: 100%;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 1rem;
  background: #fff;
}
.slideshow-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
