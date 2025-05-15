<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <h3>Square API Admin</h3>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item">
        <span class="icon">📊</span>
        <span class="label">Dashboard</span>
      </router-link>
      <router-link to="/customers" class="nav-item">
        <span class="icon">👥</span>
        <span class="label">Customers</span>
      </router-link>
      <router-link to="/invoices" class="nav-item">
        <span class="icon">📄</span>
        <span class="label">Invoices</span>
      </router-link>
      <router-link to="/estimates" class="nav-item">
        <span class="icon">📝</span>
        <span class="label">Estimates</span>
      </router-link>
      <router-link to="/schedule" class="nav-item">
        <span class="icon">📅</span>
        <span class="label">Scheduling</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <span class="icon">⚙️</span>
        <span class="label">Settings</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <span class="user-avatar">👤</span>
        <span class="user-name">Administrator</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
// No additional script needed for now
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  height: 100%;
  background: #1e1e2d;
  color: rgba(255, 255, 255, 0.87);
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.sidebar-nav {
  padding: 1rem 0;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
}

.nav-item.router-link-active {
  background: rgba(59, 89, 152, 0.2);
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
}

.icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.user-name {
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>
