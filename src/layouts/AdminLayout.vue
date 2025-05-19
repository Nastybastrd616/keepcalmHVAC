<template>
  <div class="admin-layout">
    <!-- Only one sidebar here -->
    <AdminSidebar />
    <div class="admin-main-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminSidebar.vue';
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.admin-main-content {
  flex: 1;
  padding: 2rem;
  background: #fff;
  min-height: 100vh;
}
</style>
