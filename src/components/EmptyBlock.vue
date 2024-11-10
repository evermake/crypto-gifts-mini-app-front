<script setup lang="ts">
defineProps<{
  title: string
  actionLabel: string
}>()

defineEmits<{
  action: []
}>()
</script>

<template>
  <div :class="$style.root">
    <h3 :class="$style.title">
      {{ title }}
    </h3>
    <button :class="$style.action">
      {{ actionLabel }}
    </button>
  </div>
</template>

<style lang="scss" module>
.root {
  padding: 32px 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  font-family: var(--sf-pro-text);
}

.title {
  color: var(--text);
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: -0.02688rem;
}

.action {
  color: var(--primary);
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: -0.02688rem;
}
</style>
