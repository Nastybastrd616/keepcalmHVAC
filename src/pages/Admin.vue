<template>
  <div class="admin-page">
    <h1>Admin Panel</h1>
    <section>
      <h2>Photo Gallery Management</h2>
      <p>Upload and manage slideshow/gallery images here.</p>
      <!-- Placeholder for upload UI -->
      <input type="file" multiple />
    </section>
    <section>
      <h2>User Management</h2>
      <p>View and manage users, maintenance records.</p>
      <!-- Placeholder for user management UI -->
    </section>
    <section>
      <h2>Calendar Availability</h2>
      <Calendar />
      <button class="save-btn">Save Availability</button>
    </section>
  </div>
</template>

<script setup>
import Calendar from '../components/Calendar.vue';
</script>

<style scoped>
.admin-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
section {
  margin-bottom: 2rem;
}
.save-btn {
  background: #ff9100;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
