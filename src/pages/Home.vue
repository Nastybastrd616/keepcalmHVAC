<template>  <div>
    <!-- Hero Section with Slideshow Background -->
    <section class="hero-section">
      <SlideshowGallery :images="slideshowImages" />
      <div class="hero-content">
        <h1>Don't Worry, Keep Calm HVAC is Here to Help</h1>
        <p>Your trusted partner in keeping you comfortable all year round.</p>        <div class="hero-buttons">
          <button @click="$emit('openContact')" class="request-btn">Request a Quote</button>
          <button class="login-btn" @click="$emit('goTo', 'login')">Login (Current & New Customers)</button>
          <router-link v-if="isAdmin" to="/admin" class="admin-btn">Admin Dashboard</router-link>
        </div>
      </div>
    </section>

    <!-- Quick Service Highlights -->
    <section class="service-highlights">
      <PriceCard
        v-for="service in highlights"
        :key="service.title"
        :title="service.title"
        :description="service.description"
        :price="service.price"
      >
        <template #icon>
          <span>{{ service.icon }}</span>
        </template>
      </PriceCard>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SlideshowGallery from '../components/SlideshowGallery.vue';
import PriceCard from '../components/PriceCard.vue';
import { auth, onAuthStateChanged } from '../firebase';

const slideshowImages = [
  'visitpa_Great-Lakes_Erie.jpg',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
];

const highlights = [
  { title: 'AC Installation', description: 'Fast, reliable installation for all brands.', price: '$1200+', icon: '❄️' },
  { title: 'Heating Repair', description: 'Keep your home warm and safe.', price: '$99+', icon: '🔥' },
  { title: 'Duct Cleaning', description: 'Breathe easy with clean air ducts.', price: '$199+', icon: '🌀' }
];

// User authentication
const user = ref(null);

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

const isAdmin = computed(() => {
  return user.value && (user.value.isAdmin === true || user.value.email === 'admin@example.com');
});
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 80vh;
  margin-bottom: 2rem;
  overflow: hidden;
}

.hero-section :deep(.slideshow-gallery) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-section :deep(.slideshow-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  width: 90%;
  max-width: 800px;
  z-index: 1;
}

.hero-content h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.hero-buttons button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.request-btn {
  background: var(--primary-color);
  color: white;
}

.request-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 103, 178, 0.4);
}

.login-btn {
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary-color);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.service-highlights {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
