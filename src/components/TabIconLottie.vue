<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated, useTemplateRef, watch } from 'vue'
import gifts from '~/assets/lottie/tab-gifts.json'
import leaderboard from '~/assets/lottie/tab-leaderboard.json'
import profile from '~/assets/lottie/tab-profile.json'
import store from '~/assets/lottie/tab-store.json'
import type { Tab } from '~/types'
import type { AnimationItem } from '~/vendor/lottie-svg-xs'
import LottieSvg from '~/vendor/lottie-svg-xs'

const props = defineProps<{
  tab: Tab
  active?: boolean
}>()

const emit = defineEmits<{
  ready: []
}>()

const el = useTemplateRef('div')
let animation: AnimationItem | null = null

watch(() => props.active, (newActive) => {
  if (newActive && animation) {
    animation.goToAndPlay(0, true)
  }
})

onUpdated(() => {
  if (animation) {
    emit('ready')
  }
})

onMounted(() => {
  if (!el.value) {
    console.warn('element ref is null')
    return
  }

  const animationData = (() => {
    switch (props.tab) {
      case 'store': return store
      case 'gifts': return gifts
      case 'leaderboard': return leaderboard
      case 'profile': return profile
    }
  })()

  animation = LottieSvg.loadAnimation({
    renderer: 'svg',
    animationData,
    container: el.value,
    loop: false,
    autoplay: false,
  })
  animation.setSpeed(1)

  emit('ready')
})

onUnmounted(() => {
  animation?.destroy()
  animation = null
})
</script>

<template>
  <div ref="div" :class="$style.icon" />
</template>

<style module lang="scss">
.icon {
  width: 26px;
  height: 26px;

  & svg path[fill='rgb(149,149,149)'] {
    fill: currentColor;
  }
}
</style>
