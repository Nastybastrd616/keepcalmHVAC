<template>
  <div class="services-page">
    <section class="services-hero">
      <h1>Our HVAC Services</h1>
      <p>Professional heating, cooling and ventilation solutions for your home or business</p>
    </section>
    
    <section class="service-categories">
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="activeCategory = category"
          :class="{ active: activeCategory === category }"
          class="tab-btn"
        >
          {{ category }}
        </button>
      </div>
      
      <!-- Residential Services -->
      <div v-if="activeCategory === 'Residential'" class="service-grid">
        <div v-for="service in residentialServices" :key="service.id" class="service-card">
          <div class="service-icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <div class="service-details">
            <div class="price">Starting at {{ service.price }}</div>
            <button @click="$emit('openContact', service.title)" class="quote-btn">Get Quote</button>
          </div>
        </div>
      </div>
      
      <!-- Commercial Services -->
      <div v-if="activeCategory === 'Commercial'" class="service-grid">
        <div v-for="service in commercialServices" :key="service.id" class="service-card">
          <div class="service-icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <div class="service-details">
            <div class="price">{{ service.price }}</div>
            <button @click="$emit('openContact', service.title)" class="quote-btn">Get Quote</button>
          </div>
        </div>
      </div>
      
      <!-- Emergency Services -->
      <div v-if="activeCategory === 'Emergency'" class="service-grid">
        <div class="emergency-banner">
          <h3>24/7 Emergency HVAC Service</h3>
          <p>Fast response times when you need help immediately</p>
          <button @click="$emit('goTo', 'emergency')" class="emergency-btn">Request Emergency Service</button>
        </div>
        
        <div v-for="service in emergencyServices" :key="service.id" class="service-card">
          <div class="service-icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <div class="service-details">
            <div class="price">{{ service.price }}</div>
            <button @click="$emit('goTo', 'emergency')" class="quote-btn">Request Now</button>
          </div>
        </div>
      </div>
      
      <!-- Maintenance Plans -->
      <div v-if="activeCategory === 'Maintenance'" class="service-grid">
        <MaintenancePlans @openLogin="$emit('goTo', 'login')" />
      </div>
    </section>
    
    <section class="testimonials">
      <h2>What Our Customers Say</h2>
      <div class="testimonials-grid">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial">
          <div class="quote-icon">❝</div>
          <p class="quote">{{ testimonial.content }}</p>
          <div class="author">— {{ testimonial.author }}</div>
          <div class="rating">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= testimonial.rating }">★</span>
          </div>
        </div>
      </div>
    </section>
    
    <section class="faq">
      <h2>Frequently Asked Questions</h2>
      <div class="faq-list">
        <div 
          v-for="(faq, index) in faqs" 
          :key="index"
          class="faq-item"
          :class="{ open: openFaqIndex === index }"
        >
          <div class="faq-question" @click="toggleFaq(index)">
            {{ faq.question }}
            <span class="toggle-icon">+</span>
          </div>
          <div v-if="openFaqIndex === index" class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>
    
    <section class="brands">
      <h2>Quality Brands We Work With</h2>
      <div class="brands-grid">
        <div v-for="brand in brands" :key="brand" class="brand">
          {{ brand }}
        </div>
      </div>
    </section>
    
    <section class="cta">
      <h2>Ready to Get Started?</h2>
      <p>Contact us today for a free quote on any of our services.</p>
      <div class="cta-buttons">
        <button @click="$emit('openContact')" class="cta-btn primary">Request a Quote</button>
        <button @click="$emit('goTo', 'knowledgebase')" class="cta-btn secondary">Browse Knowledge Base</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PriceCard from '../components/PriceCard.vue';
import MaintenancePlans from '../components/MaintenancePlans.vue';

const activeCategory = ref('Residential');
const categories = ['Residential', 'Commercial', 'Emergency', 'Maintenance'];
const openFaqIndex = ref(null);

// Service offerings
const residentialServices = [
  {
    id: 1,
    title: 'AC Installation',
    description: 'Professional installation of high-efficiency air conditioning systems tailored to your home.',
    price: '$1,200+',
    icon: '❄️'
  },
  {
    id: 2,
    title: 'Heating Installation',
    description: 'Expert installation of furnaces, heat pumps, and other heating systems.',
    price: '$1,500+',
    icon: '🔥'
  },
  {
    id: 3,
    title: 'AC Repair',
    description: 'Diagnostic and repair services to keep your cooling system running smoothly.',
    price: '$99+',
    icon: '🛠️'
  },
  {
    id: 4,
    title: 'Heating Repair',
    description: 'Fast, reliable repairs for all types of heating systems.',
    price: '$99+',
    icon: '🔧'
  },
  {
    id: 5,
    title: 'Duct Cleaning',
    description: 'Remove dust, allergens, and improve air quality with professional duct cleaning.',
    price: '$299+',
    icon: '💨'
  },
  {
    id: 6,
    title: 'Smart Thermostat Installation',
    description: 'Upgrade to a programmable or smart thermostat for better comfort and energy savings.',
    price: '$249+',
    icon: '🌡️'
  }
];

const commercialServices = [
  {
    id: 1,
    title: 'Commercial HVAC Installation',
    description: 'Complete design and installation services for office buildings, retail, and more.',
    price: 'Custom Quote',
    icon: '🏢'
  },
  {
    id: 2,
    title: 'Preventative Maintenance',
    description: 'Regular service to prevent costly breakdowns and extend equipment life.',
    price: 'Custom Quote',
    icon: '⚙️'
  },
  {
    id: 3,
    title: 'Rooftop Unit Service',
    description: 'Installation, maintenance and repair of commercial rooftop HVAC units.',
    price: 'Custom Quote',
    icon: '🏗️'
  },
  {
    id: 4,
    title: 'Commercial Refrigeration',
    description: 'Service and installation for restaurants, grocery stores, and food service businesses.',
    price: 'Custom Quote',
    icon: '❄️'
  }
];

const emergencyServices = [
  {
    id: 1,
    title: 'After-Hours AC Repair',
    description: 'Emergency cooling repairs available 24/7.',
    price: 'Starting at $199',
    icon: '🆘'
  },
  {
    id: 2,
    title: 'Emergency Heating Repair',
    description: 'Fast response when your heating system fails in cold weather.',
    price: 'Starting at $199',
    icon: '🔥'
  },
  {
    id: 3,
    title: 'Water Leak Response',
    description: 'Quick action for HVAC water leaks to prevent property damage.',
    price: 'Starting at $149',
    icon: '💧'
  }
];

const testimonials = [
  {
    id: 1,
    content: 'The technician was on time, professional and fixed our AC in under an hour. Outstanding service!',
    author: 'Sarah M.',
    rating: 5
  },  {
    id: 2,
    content: "We've been using their maintenance plan for years. Well worth the investment - our system runs perfectly.",
    author: "Robert J.",
    rating: 5
  },
  {
    id: 3,
    content: 'Called with an emergency on Sunday, and they had a technician at our house within 2 hours. Excellent service.',
    author: 'David K.',
    rating: 4
  }
];

const faqs = [
  {
    question: 'How often should I change my air filter?',
    answer: 'For standard 1-inch filters, we recommend changing them every 1-3 months. For thicker filters (3-5 inches), every 6-12 months. If you have pets or allergies, you may need to change them more frequently.'
  },  {
    question: 'What temperature should I set my thermostat to?',
    answer: 'For optimal energy efficiency, we recommend 78°F in summer and 68°F in winter when you\'re home. You can save more by adjusting the temperature by 7-10 degrees for 8 hours a day (while at work or sleeping).'
  },
  {
    question: 'How long does an HVAC system typically last?',
    answer: 'With proper maintenance, air conditioners and heat pumps typically last 10-15 years, while furnaces can last 15-20 years. Regular maintenance can extend the lifespan of your equipment.'
  },
  {
    question: 'Do you offer financing options?',
    answer: 'Yes, we offer flexible financing plans with approved credit. We have options for 0% interest for 12 months on new installations, as well as longer-term financing with competitive rates.'
  },
  {
    question: 'How do I know if I need a new HVAC system?',
    answer: 'Consider replacement if your system is over 10 years old, requires frequent repairs, causes significant increases in energy bills, or struggles to maintain comfortable temperatures. We offer free in-home evaluations to help you decide.'
  }
];

const brands = [
  'Carrier', 'Trane', 'Lennox', 'Rheem', 'American Standard', 'Bryant', 'Goodman', 'Daikin'
];

function toggleFaq(index) {
  if (openFaqIndex.value === index) {
    openFaqIndex.value = null;
  } else {
    openFaqIndex.value = index;
  }
}
</script>

<style scoped>
.services-page {
  max-width: 1200px;
  margin: 0 auto;
}

.services-hero {
  text-align: center;
  margin-bottom: 3rem;
}

.services-hero h1 {
  color: #3b5998;
  margin-bottom: 1rem;
}

.category-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  white-space: nowrap;
}

.tab-btn.active {
  color: #3b5998;
  border-bottom-color: #3b5998;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.service-card {
  background: #fff;
  color: #222;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 89, 152, 0.12);
  border: 1px solid rgba(59, 89, 152, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(59, 89, 152, 0.18);
}

.service-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #3b5998;
}

.service-card p {
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.service-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.price {
  font-weight: bold;
}

.quote-btn {
  background: #3b5998;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Emergency Banner */
.emergency-banner {
  grid-column: 1 / -1;
  background: linear-gradient(to right, #ff9800, #f44336);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.emergency-banner h3 {
  margin-top: 0;
}

.emergency-btn {
  background: white;
  color: #f44336;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
}

/* Testimonials */
.testimonials {
  margin-bottom: 3rem;
}

.testimonials h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #3b5998;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial {
  background: #f9f9fb;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
}

.quote-icon {
  font-size: 3rem;
  color: #e0e0e0;
  position: absolute;
  top: 1rem;
  left: 1rem;
  line-height: 1;
}

.quote {
  position: relative;
  z-index: 1;
  font-style: italic;
  margin-bottom: 1.5rem;
}

.author {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.rating .star {
  color: #e0e0e0;
}

.rating .star.filled {
  color: #FFC107;
}

/* FAQ */
.faq {
  margin-bottom: 3rem;
}

.faq h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #3b5998;
}

.faq-item {
  border-bottom: 1px solid #eee;
}

.faq-question {
  padding: 1.5rem 0;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-icon {
  font-size: 1.5rem;
  transition: transform 0.3s;
}

.faq-item.open .toggle-icon {
  transform: rotate(45deg);
}

.faq-answer {
  padding-bottom: 1.5rem;
  line-height: 1.6;
}

/* Brands */
.brands {
  margin-bottom: 3rem;
}

.brands h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #3b5998;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2rem;
}

.brand {
  background: #333333;
  border-radius: 10px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(59, 89, 152, 0.08);
  border: 1px solid rgba(59, 89, 152, 0.1);
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
  color: rgba(255, 255, 255, 0.87);
}

.brand:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(59, 89, 152, 0.12);
}

/* CTA */
.cta {
  background: #f9f9fb;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 2rem;
}

.cta h2 {
  margin-top: 0;
  color: #3b5998;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.cta-btn.primary {
  background: #3b5998;
  color: white;
}

.cta-btn.secondary {
  background: white;
  color: #3b5998;
  border: 1px solid #3b5998;
}

@media (max-width: 768px) {
  .service-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
