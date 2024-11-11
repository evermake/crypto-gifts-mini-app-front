<script setup lang="ts">
import { BALLOONS_STICKER_ID } from '~/config'
import Sticker from './Sticker.vue'

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
    <Sticker :id="BALLOONS_STICKER_ID" :class="$style.sticker" />
    <h3 :class="$style.title">
      {{ title }}
    </h3>
    <button
      :class="$style.action"
      @click="$emit('action')"
    >
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
  font-family: var(--font-sf-pro-text);
}

.title {
  color: var(--text);
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: -0.02688rem;
}

.sticker {
  width: 100px;
  height: 100px;
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
