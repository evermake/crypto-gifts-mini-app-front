<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import animationData from '~/assets/lottie/effect-gift-purchased.json'
import type { AnimationItem } from '~/vendor/lottie-svg-xs'
import LottieSvg from '~/vendor/lottie-svg-xs'

const el = useTemplateRef('root')
let animation: AnimationItem | null = null

onMounted(() => {
  if (!el.value) {
    console.warn('element ref is null')
    return
  }

  animation = LottieSvg.loadAnimation({
    renderer: 'svg',
    animationData,
    container: el.value,
    loop: false,
    autoplay: true,
  })
  animation.setSpeed(1)
})

onUnmounted(() => {
  animation?.destroy()
  animation = null
})
</script>

<template>
  <div ref="root" :class="$style.confetti" />
</template>

<style lang="scss" module>
.confetti {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
}
</style>
