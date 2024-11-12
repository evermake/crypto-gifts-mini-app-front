import type { RouteRecordRaw } from 'vue-router'
import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import GiftKind from './routes/GiftKind.vue'
import GiftPurchased from './routes/GiftPurchased.vue'
import GiftReceived from './routes/GiftReceived.vue'
import Gifts from './routes/Gifts.vue'
import Leaderboard from './routes/Leaderboard.vue'
import Profile from './routes/Profile.vue'
import Store from './routes/Store.vue'
import { tryTo } from './utils/tma'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: { name: 'me' } },
  { path: '/profile', redirect: { name: 'me' } },
  {
    path: '/me',
    name: 'me',
    component: Profile,
    props: { me: true },
  },
  {
    path: '/users/:userId',
    name: 'user',
    component: Profile,
    props: true, // Use params as props.
    meta: { showBackButton: true },
  },

  { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
  { path: '/gifts', name: 'gifts', component: Gifts },
  { path: '/store', name: 'store', component: Store },

  {
    path: '/store/:kindId',
    component: GiftKind,
    name: 'gift-kind',
    meta: { showBackButton: true },
  },

  {
    path: '/gift-purchased',
    name: 'gift-purchased',
    component: GiftPurchased,
    meta: { showBackButton: true },
  },
  {
    path: '/gift-received',
    name: 'gift-received',
    component: GiftReceived,
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
