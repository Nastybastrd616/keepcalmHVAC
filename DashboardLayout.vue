<template>  <div class="dashboard-layout-horizontal">
    <header class="top-nav">
      <nav class="top-nav-menu left">
        <ul>
          <li><router-link to="/" custom v-slot="{ navigate }">
            <button @click="navigate">Home</button>
          </router-link></li>
        </ul>
      </nav>
      <div class="nav-title">KEEP CALM</div>
      <nav class="top-nav-menu right">
        <ul>
          <li><router-link to="/services" custom v-slot="{ navigate }">
            <button @click="navigate">Services</button>
          </router-link></li>
          <li><router-link to="/about" custom v-slot="{ navigate }">
            <button @click="navigate">About</button>
          </router-link></li>
          <li><router-link to="/contact" custom v-slot="{ navigate }">
            <button @click="navigate">Contact</button>
          </router-link></li>
        </ul>
      </nav>
    </header>
    <section class="content-area">
      <slot />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.dashboard-layout-horizontal {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #e3eafc; /* very light blue background */
}
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #3b5998; /* lighter blue */
  color: #fff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
}
.nav-title {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-align: center;
  flex: 1;
  color: #ff9100; /* orange */
  justify-content: center;
}
.top-nav-menu {
  flex: 1 1 0;
  display: flex;
  justify-content: center;
}
.top-nav-menu.left {
  justify-content: flex-start;
}
.top-nav-menu.right {
  justify-content: flex-end;
}
.top-nav-menu ul {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.top-nav-menu li {
  padding: 0;
}
.top-nav-menu button {
  background: transparent;
  color: #ff9100;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.top-nav-menu button:hover {
  background: rgba(255,145,0,0.12);
  color: #fff;
}
.content-area {
  flex: 1;
  padding: 2rem;
  background: #f9f9fb;
  margin-top: 120px; /* Offset for sticky nav bar */
}
@media (max-width: 900px) {
  .top-nav {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .nav-title {
    margin: 1rem 0;
    justify-content: center;
  }
  .top-nav-menu ul {
    flex-direction: column;
    gap: 1rem;
  }
  .content-area {
    padding: 1rem;
  }
  .top-nav-menu.left, .nav-title, .top-nav-menu.right {
    justify-content: center;
  }
}
</style>
