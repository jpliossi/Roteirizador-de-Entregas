import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'enderecos',
          name: 'enderecos',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'veiculos',
          name: 'veiculos',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'motoristas',
          name: 'motoristas',
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: 'rotas',
          name: 'rotas',
          component: () => import('@/views/HomeView.vue')
        }
      ]
    }
  ]
})

export default router