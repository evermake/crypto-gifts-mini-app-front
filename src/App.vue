<script setup lang="ts">
import type { Tab } from './types'
import { useThrottleFn } from '@vueuse/core'
import { computed, onMounted, ref, watchEffect } from 'vue'
import TapBar from './components/TabBar.vue'
import Profile from './pages/Profile.vue'
import StarsEffect from './pages/StarsEffect.vue'

const tab = ref<Tab>('profile')

const innerHeight = ref(window.innerHeight)
const outerHeight = ref(window.outerHeight)
const recalculate = useThrottleFn(() => {
  innerHeight.value = window.innerHeight
  outerHeight.value = window.outerHeight
}, 100)
onMounted(() => {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.disableVerticalSwipes()
  Telegram.WebApp.setBackgroundColor('#F5F5F5')

  document.addEventListener('scroll', () => {
    const isOverscrolledBottom = document.documentElement.scrollTop + window.innerHeight > document.documentElement.scrollHeight
    if (!isOverscrolledBottom) {
      recalculate()
    }
  })
})

const windowHeightsDiff = computed(() => (Math.max(0, outerHeight.value - innerHeight.value)))
watchEffect(() => {
  document.documentElement.style.setProperty('--window-h-diff', `${windowHeightsDiff.value}px`)
})
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.page">
      <Profile v-if="tab === 'profile'" />
      <StarsEffect v-else-if="tab === 'gifts'" />
    </div>
    <TapBar v-model:tab="tab" :class="$style.tabbar" />
  </div>
</template>

<style module lang="scss">
.root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}
.page {
  flex: 1 0 auto;
}
.tabbar {
  position: sticky;
  bottom: 0;
}
</style>
