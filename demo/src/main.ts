import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: '/basic', component: () => import('./routes/_basic.vue') }]
});

createApp(App).use(router).mount('#app');
