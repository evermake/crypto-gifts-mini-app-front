<script setup lang="ts">
import type { Tab } from './types'
import { onMounted, ref } from 'vue'
import TabBar from './components/TabBar.vue'
import Gifts from './pages/Gifts.vue'
import Profile from './pages/Profile.vue'
import Store from './pages/Store.vue'

const tab = ref<Tab>('profile')

onMounted(() => {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.disableVerticalSwipes()
})
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.page">
      <Store v-if="tab === 'store'" />
      <Gifts v-else-if="tab === 'gifts'" />
      <Profile v-else-if="tab === 'profile'" me />
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
