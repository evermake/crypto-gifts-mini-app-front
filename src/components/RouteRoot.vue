<script setup lang="ts">
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { useTemplateRef } from 'vue'
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
      const { top, left } = root.value.getBoundingClientRect()
      root.value.style.position = 'fixed'
      root.value.style.top = `${top}px`
      root.value.style.left = `${left}px`
    }
  }
})
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>
