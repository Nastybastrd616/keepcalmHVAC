<script setup lang="ts">
import DashboardLayout from './layouts/DashboardLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
// @ts-ignore
import ContactModal from './components/ContactModal.vue'
// @ts-ignore
import { auth, onAuthStateChanged } from './firebase';

const showContactModal = ref(false)
const user = ref(null as any);
const route = useRoute();

// Check if the current route is an admin route
const isAdminRoute = computed(() => {
  const adminRoutes = ['/admin', '/customers', '/invoices', '/estimates', '/schedule', '/settings'];
  return adminRoutes.includes(route.path);
});

onAuthStateChanged(auth, (u: any) => {
  user.value = u;
});

function openContact() {
  showContactModal.value = true
}

function closeContact() {
  showContactModal.value = false
}
</script>

<template>
  <!-- Use AdminLayout for admin routes, DashboardLayout for everything else -->
  <AdminLayout v-if="isAdminRoute">
    <router-view @openContact="openContact" />
    <ContactModal v-if="showContactModal" @close="closeContact" />
  </AdminLayout>
  <DashboardLayout v-else>
    <router-view @openContact="openContact" />
    <ContactModal v-if="showContactModal" @close="closeContact" />
  </DashboardLayout>
</template>

<style scoped>
.page-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.page-nav button {
  background: #ff9100;
  color: #fff;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.page-nav button:hover {
  background: #3b5998;
}
</style>
