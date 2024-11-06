<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { useStarsEffect } from '~/utils/stars-effect'

const props = defineProps<{
  width: number
  height: number
}>()

const { init, stop } = useStarsEffect()
const canvas = useTemplateRef('canvas')
let reqId: number | null = null

onMounted(() => {
  if (!canvas.value) {
    console.warn('Canvas is undefined.')
    return
  }

  reqId = init(canvas.value, props.width, props.height)
})

onUnmounted(() => {
  if (reqId) {
    stop(reqId)
  }
})
</script>

<template>
  <canvas ref="canvas" />
</template>
