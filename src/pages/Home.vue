<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <h1>Welcome to CoolAir HVAC</h1>
      <p>Your trusted partner for heating, ventilation, and air conditioning solutions.</p>
      <button @click="$emit('openContact')">Request a Quote</button>
      <button class="login-btn" @click="$emit('goTo', 'login')">Login (Current & New Customers)</button>
    </section>

    <!-- Slideshow Section -->
    <section class="slideshow-section">
      <SlideshowGallery :images="slideshowImages" />
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
import SlideshowGallery from '../components/SlideshowGallery.vue';
import PriceCard from '../components/PriceCard.vue';

const slideshowImages = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80'
];

const highlights = [
  { title: 'AC Installation', description: 'Fast, reliable installation for all brands.', price: '$1200+', icon: '❄️' },
  { title: 'Heating Repair', description: 'Keep your home warm and safe.', price: '$99+', icon: '🔥' },
  { title: 'Duct Cleaning', description: 'Breathe easy with clean air ducts.', price: '$199+', icon: '🌀' }
];
</script>

<style scoped>
.hero {
  text-align: center;
  margin-bottom: 2rem;
}
.slideshow-section {
  margin: 2rem 0;
}
.service-highlights {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
