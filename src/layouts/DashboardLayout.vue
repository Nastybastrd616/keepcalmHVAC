<template>
  <div class="dashboard-layout-horizontal">
    <header class="top-nav">
      <div class="nav-container">
        <!-- Logo area -->
        <div class="nav-logo">
          <router-link to="/" class="logo-link">
            <img src="/new-nav-logo.svg" alt="Keep Calm HVAC Logo" class="nav-logo-image" />
          </router-link>
        </div>
        
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span class="menu-icon"></span>
        </button>
        
        <!-- Navigation links -->
        <nav class="nav-links" :class="{ 'mobile-open': mobileMenuOpen }">
          <router-link to="/" class="nav-link" active-class="active">Home</router-link>
          <router-link to="/services" class="nav-link" active-class="active">Services</router-link>
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
          <router-link to="/contact" class="nav-link" active-class="active">Contact</router-link>
        </nav>
          <!-- Action buttons -->
        <div class="nav-actions" :class="{ 'mobile-open': mobileMenuOpen }">          <button class="action-btn emergency-btn" @click="openEmergencyModal">
            <span class="btn-icon">🚨</span>Request Emergency Service
          </button>
          <button class="action-btn login-btn" @click="openLoginModal">
            <span class="btn-icon">{{ user ? '👤' : '🔑' }}</span>
            {{ user ? 'My Account' : 'Login' }}
          </button>
        </div>
      </div>
    </header>
    
    <section class="content-area">
      <slot />
    </section>
      <!-- Login Modal -->
    <LoginModal v-if="showLoginModal" @close="closeLoginModal" @loginSuccess="handleLoginSuccess" />
    
    <!-- Emergency Service Modal -->
    <EmergencyModal v-if="showEmergencyModal" @close="closeEmergencyModal" @optionSelected="handleEmergencyOptionSelected" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoginModal from '../components/LoginModal.vue';
import EmergencyModal from '../components/EmergencyModal.vue';
import { auth, onAuthStateChanged } from '../firebase';

const router = useRouter();
const showLoginModal = ref(false);
const showEmergencyModal = ref(false);
const user = ref(null);
const mobileMenuOpen = ref(false);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function openLoginModal() {
  if (user.value) {
    // If user is logged in, redirect to dashboard or account page
    router.push('/dashboard');
  } else {
    // If no user, show login modal
    showLoginModal.value = true;
  }
  mobileMenuOpen.value = false;
}

function closeLoginModal() {
  showLoginModal.value = false;
}

function handleLoginSuccess() {
  closeLoginModal();
  // Optionally redirect to dashboard or reload current page
}
</script>

<style scoped>
.dashboard-layout-horizontal {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--background-color);
}

/* Modern Navigation Styling */
.top-nav {
  background: linear-gradient(90deg, #ff9100 0%, #4267b2 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0.8rem 2rem;
}

/* Logo styling */
.nav-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  height: 50px;
  padding: 5px 0;
}

.nav-logo-image {
  height: 45px;
  width: auto;
  object-fit: contain;
  display: block;
  transition: transform 0.2s ease;
  margin: 5px 0;
}

/* Navigation links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #ff9100;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover {
  color: #fff;
}

.nav-link:hover::after, 
.nav-link.active::after {
  width: 70%;
}

.nav-link.active {
  color: #fff;
  font-weight: 600;
}

/* Action buttons */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-icon {
  margin-right: 0.4rem;
  font-size: 1.1rem;
}

.emergency-btn {
  background-color: #d9261c;
  color: #fff;
  border: 2px solid #fff;
  animation: pulse 2s infinite;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 700;
}

.emergency-btn:hover {
  background-color: #f13529;
  border-color: #fff;
  animation: none;
  transform: scale(1.05);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(217, 38, 28, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(217, 38, 28, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(217, 38, 28, 0);
  }
}

.login-btn {
  background-color: #ff9100;
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 145, 0, 0.4);
}

.login-btn:hover {
  background-color: #ff9f25;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 145, 0, 0.5);
}

/* Mobile menu button */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: relative;
  z-index: 1010;
}

.menu-icon, 
.menu-icon::before, 
.menu-icon::after {
  content: '';
  display: block;
  position: absolute;
  height: 2px;
  width: 24px;
  background: #fff;
  transition: all 0.3s ease;
}

.menu-icon {
  top: 19px;
  left: 8px;
}

.menu-icon::before {
  top: -8px;
  left: 0;
}

.menu-icon::after {
  top: 8px;
  left: 0;
}

/* Mobile Responsiveness */
@media (max-width: 992px) {
  .nav-container {
    padding: 0.8rem 1.5rem;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .nav-links, .nav-actions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #273469;
    padding: 1rem;
    gap: 1rem;
    align-items: stretch;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
  }
  
  .nav-links.mobile-open, 
  .nav-actions.mobile-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0.15);
  }
  
  .nav-links {
    top: 68px;
    padding-bottom: 0;
  }
  
  .nav-actions {
    top: 224px; /* Adjusted based on nav-links height */
  }
  
  .nav-link {
    padding: 0.75rem;
    text-align: center;
  }
  
  .nav-link::after {
    display: none;
  }
    .action-btn {
    justify-content: center;
    padding: 0.8rem;
  }
  
  .emergency-btn {
    order: -1;
    margin-bottom: 0.5rem;
  }
}

.content-area {
  flex: 1;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.87);
}

@media (max-width: 576px) {
  .logo-text {
    font-size: 1.2rem;
  }
  
  .content-area {
    padding: 1.5rem;
  }
}
</style>
