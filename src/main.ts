import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import './assets/enhanced-styles.css' // Added enhanced styles
import App from './App.vue'
import router from './router'

// Create Vue app
const app = createApp(App)

// Create and use Pinia store
const pinia = createPinia()
app.use(pinia)

// Use router
app.use(router)

// Mount the app
app.mount('#app')
