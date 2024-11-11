<script setup lang="ts">
import type { Tab } from './types'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TabBar from './components/TabBar.vue'

const router = useRouter()

const tab = computed({
  get: () => {
    switch (router.currentRoute.value.path) {
      case '/profile': return 'profile'
      case '/leaderboard': return 'leaderboard'
      case '/store': return 'store'
      case '/gifts': return 'gifts'
    }
    return null
  },
  set: (newTab: Tab) => {
    switch (newTab) {
      case 'store': return void router.replace('/store')
      case 'gifts': return void router.replace('/gifts')
      case 'leaderboard': return void router.replace('/leaderboard')
      case 'profile': return void router.replace('/profile')
    }
  },
})

onMounted(() => {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.disableVerticalSwipes()
})
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.page">
      <RouterView />
    </div>
    <TabBar v-model:tab="tab" :class="$style.tabbar" />
  </div>
</template>

<style module lang="scss">
.root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
}
.page {
  flex: 1 0 auto;
}
</style>
