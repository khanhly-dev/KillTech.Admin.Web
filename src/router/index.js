import Layout from '../layouts/Layout.vue'
import ProductList from '../views/Product/ProductList.vue'
import ProductCategopryList from '../views/ProductCategory/ProductCategoryList.vue'
import Tag from '../views/Tag/Tag.vue'
import Home from '../views/Home/Home.vue'
import Bill from '../views/Bill/Bill.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/product',
      component: ProductList
    },
    {
      path: '/category',
      component: ProductCategopryList
    },
    {
      path: '/tag',
      component: Tag
    },
    {
      path: '/bill',
      component: Bill
    },
  ]
})

export default router
