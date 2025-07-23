import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
  },
  {
    path: '/my-land',
    name: 'MyLand',
    component: () => import('../pages/MyLand.vue'),
  },
  {
    path: '/transfers',
    name: 'Transfers',
    component: () => import('../pages/Transfers.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../pages/Auth.vue'), // Placeholder, to be created
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../pages/Map.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 