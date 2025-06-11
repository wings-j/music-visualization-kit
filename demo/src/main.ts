import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import './style.css';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('./routes/index.vue') },
    { name: 'basic', path: '/basic', component: () => import('./routes/pages/_basic.vue') },
    { name: 'line-tides', path: '/line-tides', component: () => import('./routes/pages/line-tides.vue') }
  ]
});

createApp(App).use(router).mount('#app');
