import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
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
    path: '/',
    redirect: '/my-land',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 