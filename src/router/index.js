import Layout from '../layouts/Layout.vue'
import ProductList from '../views/Product/ProductList.vue'
import ProductCategopryList from '../views/ProductCategory/ProductCategoryList.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout
    },
    {
      path: '/product',
      component: ProductList
    },
    {
      path: '/category',
      component: ProductCategopryList
    },
  ]
})

export default router
