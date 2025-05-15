import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Services from './pages/Services.vue';
import About from './pages/About.vue';
import Contact from './pages/Contact.vue';
import Login from './pages/Login.vue';
import Dashboard from './pages/Dashboard.vue';
import Admin from './pages/Admin.vue';
import CustomersPage from './pages/CustomersPage.vue';
import InvoicesPage from './pages/InvoicesPage.vue';
import EstimatesPage from './pages/EstimatesPage.vue';
import SchedulingPage from './pages/SchedulingPage.vue';
import Settings from './pages/Settings.vue';
import { auth } from './firebase';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: false }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/emergency',
    name: 'EmergencyService',
    component: () => import('./components/EmergencyService.vue'),
    meta: { requiresAuth: false }
  },  {
    path: '/knowledge',
    name: 'KnowledgeBase',
    component: () => import('./components/KnowledgeBase.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: CustomersPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: InvoicesPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/estimates',
    name: 'Estimates',
    component: EstimatesPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/schedule',
    name: 'Scheduling',
    component: SchedulingPage,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guards for authentication
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !currentUser) {
    next('/login');  } else if (requiresAdmin) {
    // Check if user has admin role
    if (currentUser && (currentUser.isAdmin === true || currentUser.email === 'admin@example.com')) {
      next();
    } else {
      next('/');
    }
  } else {
    next();
  }
});

export default router;
