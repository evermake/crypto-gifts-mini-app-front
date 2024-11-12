<script setup lang="ts">
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { onActivated, useTemplateRef } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const props = defineProps<{
  shouldFade?: (to: RouteLocationNormalizedGeneric) => boolean
}>()

const root = useTemplateRef('root')

onBeforeRouteLeave((to) => {
  if (props.shouldFade?.(to)) {
    to.meta.willFade = true
    // Fix position to avoid jumping.
    if (root.value) {
      const { top, left, width, height } = root.value.getBoundingClientRect()
      root.value.style.position = 'fixed'
      root.value.style.top = `${top}px`
      root.value.style.left = `${left}px`
      root.value.style.width = `${width}px`
      root.value.style.height = `${height}px`
    }
  }
  else {
    to.meta.willFade = false
  }
})

onActivated(() => {
  root.value!.style.position = ''
  root.value!.style.top = ''
  root.value!.style.left = ''
  root.value!.style.width = ''
  root.value!.style.height = ''
})
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
