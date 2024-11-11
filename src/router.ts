import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import GiftKind from './routes/GiftKind.vue'
import Gifts from './routes/Gifts.vue'
import MyProfile from './routes/MyProfile.vue'
import Store from './routes/Store.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/profile' },
  { path: '/profile', component: MyProfile },
  { path: '/gifts', component: Gifts },

  { path: '/store', component: Store },
  { path: '/store/:kindId', component: GiftKind },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
