<script setup lang="ts">
import { DotLottieWorker } from '@lottiefiles/dotlottie-web'
import {
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  shallowRef,
  useTemplateRef,
} from 'vue'
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
const completed = ref(false)

async function continuePlaying() {
  const inst = lottie.value
  if (inst) {
    if (inst.isFrozen) {
      await inst.unfreeze()
    }
    await inst.play()
    completed.value = false
  }
}

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
      renderConfig: {
        freezeOnOffscreen: false,
      },
      workerId,
    })
  }
  else {
    instance = new DotLottieWorker({ canvas: canvas.value })
  }

  instance.addEventListener('play', () => {
    emit('ready')
  })

  canvas.value.addEventListener('click', () => {
    continuePlaying()
  })

  lottie.value = instance
})

onActivated(() => {
  continuePlaying()
})

onDeactivated(() => {
  lottie.value?.freeze()
})

onUnmounted(() => {
  lottie.value?.destroy()
})
</script>

<template>
  <canvas ref="canvas" />
</template>

<style lang="scss" module>
</style>
