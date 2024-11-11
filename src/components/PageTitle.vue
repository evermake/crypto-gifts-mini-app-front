<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div :class="$style.root">
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  align-items: center;
  font-family: var(--font-sf-pro);
  padding: 0 32px;

  h1 {
    color: var(--text);
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 590;
    line-height: 2rem;
    letter-spacing: -0.02688rem;
  }

  h2 {
    color: var(--text-secondary);
    font-size: 1.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: -0.02688rem;
  }
}
</style>
