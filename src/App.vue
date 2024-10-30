<script setup lang="ts">
import type { Tab } from './components/TapBar.vue'
import { useThrottleFn } from '@vueuse/core'
import { computed, onMounted, ref, watchEffect } from 'vue'
import TapBar from './components/TapBar.vue'
import Profile from './pages/Profile.vue'

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
      <div v-else>
        <img v-for="(_, i) in Array.from({ length: 29 }).fill(null)" :key="i" src="/tmp.png" alt="">
      </div>
    </div>
    <TapBar v-model:tab="tab" :class="$style.tapbar" />
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
.tapbar {
  position: sticky;
  bottom: 0;
}
</style>
