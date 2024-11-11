<template>
  <img :class="$style.tgPattern" src="/tg-pattern.svg">
</template>

<style module lang="scss">
.tgPattern {
  object-fit: cover;
  opacity: 0.65;
  mix-blend-mode: overlay;

  :global(.dark) & {
    opacity: 0.1;
    mix-blend-mode: unset;
  }
}
</style>
