import type { RouteRecordRaw } from 'vue-router'
import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import GiftKind from './routes/GiftKind.vue'
import Gifts from './routes/Gifts.vue'
import MyProfile from './routes/MyProfile.vue'
import Store from './routes/Store.vue'
import { tryTo } from './utils/tma'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/profile' },
  { path: '/profile', component: MyProfile },
  { path: '/gifts', component: Gifts },

  { path: '/store', component: Store, name: 'store' },
  {
    path: '/store/:kindId',
    component: GiftKind,
    name: 'gift-kind',
    meta: { showBackButton: true },
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

tryTo(app => void app.BackButton.onClick(() => {
  router.back()
}))

watch(router.currentRoute, (newRoute) => {
  tryTo((app) => {
    app.BackButton.isVisible = Boolean(newRoute.meta.showBackButton)
  })
})
