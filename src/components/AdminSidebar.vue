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
  background: #fff;
  color: #222;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  box-shadow: 0 0 32px 8px rgba(0,0,0,0.22);
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.sidebar-nav {
  padding: 1rem 0;
  flex: 1;
  background: #fff;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #444;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  border-radius: 6px 0 0 6px;
}

.nav-item:hover {
  background: #f5f7fa;
  color: var(--primary-color);
}

.nav-item.router-link-active {
  background: #eaf1fb;
  color: var(--primary-color);
  border-left: 3px solid var(--primary-color);
}

.icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  background: #fff;
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
