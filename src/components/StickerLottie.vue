<script setup lang="ts">
import { DotLottieWorker } from '@lottiefiles/dotlottie-web'
import { computed, onMounted, onUnmounted, shallowRef, useTemplateRef, watchEffect } from 'vue'
import { getLottieWorkerId } from '~/utils/lottie'

const props = defineProps<{
  isStar?: boolean
  src?: string | null
}>()

const emit = defineEmits<{
  ready: []
}>()

const canvas = useTemplateRef('canvas')
const lottie = shallowRef<DotLottieWorker | null>(null)
const src = computed(() => props.src)
const isStar = computed(() => props.isStar)
let lottieCurrentSrc: string | null = null

watchEffect(() => {
  if (src.value && lottie.value && src.value !== lottieCurrentSrc) {
    lottieCurrentSrc = src.value
    lottie.value.load({
      src: lottieCurrentSrc,
      autoplay: true,
      mode: isStar.value ? 'reverse-bounce' : 'forward',
    })
  }
})

onMounted(() => {
  if (!canvas.value) {
    console.warn('no canvas')
    return
  }

  const workerId = getLottieWorkerId()
  let instance
  if (src.value) {
    lottieCurrentSrc = src.value
    instance = new DotLottieWorker({
      canvas: canvas.value,
      src: lottieCurrentSrc,
      autoplay: true,
      mode: isStar.value ? 'reverse-bounce' : 'forward',
      workerId,
    })
  }
  else {
    instance = new DotLottieWorker({ canvas: canvas.value })
  }

  instance.addEventListener('play', () => {
    emit('ready')
  })

  lottie.value = instance
})

onUnmounted(() => {
  if (lottie.value) {
    lottie.value.destroy()
  }
})
</script>

<template>
  <canvas ref="canvas" />
</template>

<style lang="scss" module>
</style>
