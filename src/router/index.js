import { createRouter, createWebHistory } from 'vue-router';
import home from './home.js';
import admin from './admin.js';

const routes = [...home, ...admin ];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const defaultTitle = 'Portfolio - Bùi Lê Minh Huy';
  document.title = to.meta.title || defaultTitle;
  next();
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user');
  if(to.meta.requiresAuth && !isLoggedIn){
    next('/login');
  }
  else {
    next();
  }
});
export default router;
