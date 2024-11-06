<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import type { Tab } from '~/types'

defineProps<{
  tab: Tab
  active?: boolean
}>()

const TabIconLottie = defineAsyncComponent(() => import('~/components/TabIconLottie.vue'))
const lottieReady = ref(false)
</script>

<template>
  <TabIconLottie
    v-show="lottieReady"
    :tab="tab"
    :active="active"
    @ready="lottieReady = true"
  />
  <div v-show="!lottieReady" class="icon" :class="[$style.icon, `i-${tab}`]" />
</template>

<style lang="scss" module>
.icon {
  font-size: 26px;
}
</style>
