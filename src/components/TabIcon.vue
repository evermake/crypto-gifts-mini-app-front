<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import type { Tab } from '~/types'
import TabIconSvg from './TabIconSvg.vue'

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
  <TabIconSvg v-show="!lottieReady" :tab="tab" />
</template>
