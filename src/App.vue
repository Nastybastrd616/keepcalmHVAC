<script setup lang="ts">
import DashboardLayout from './layouts/DashboardLayout.vue'
import { ref } from 'vue'
// @ts-ignore
import ContactModal from './components/ContactModal.vue'
// @ts-ignore
import { auth, onAuthStateChanged } from './firebase';

const showContactModal = ref(false)
const user = ref(null as any);

onAuthStateChanged(auth, (u) => {
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
  <DashboardLayout>
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
