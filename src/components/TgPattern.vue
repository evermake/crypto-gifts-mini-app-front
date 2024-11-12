<script setup lang="ts">
import '~/assets/css/tg-pattern.css'
</script>

<template>
  <div class="tg-pattern" :class="$style.tgPattern" />
</template>

<style module lang="scss">
.tgPattern {
  pointer-events: none;
  aspect-ratio: 368 / 796;
  width: 368px;

  background-image: var(--tg-pattern);
  background-position: center;
  background-size: cover;

  opacity: 0.65;
  mix-blend-mode: overlay;

  :global(.dark) & {
    opacity: 0.1;
    mix-blend-mode: unset;
  }
}
</style>
