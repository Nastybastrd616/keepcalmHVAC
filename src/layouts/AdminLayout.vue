<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-content">
      <header class="admin-header">
        <h1>{{ pageTitle }}</h1>
        <div class="header-actions">
          <!-- You can add header actions here -->
        </div>
      </header>
      <div class="admin-body">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from '../components/AdminSidebar.vue';

const route = useRoute();

// Compute the page title based on the current route
const pageTitle = computed(() => {
  return route.name || 'Admin Panel';
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #2a2a2a;
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.admin-header {
  padding: 1rem 2rem;
  background-color: #333333;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.87);
}

.admin-body {
  flex: 1;
  padding: 1rem 2rem;
  overflow: auto;
}
</style>
