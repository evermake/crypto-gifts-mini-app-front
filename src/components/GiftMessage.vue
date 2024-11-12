<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Notification from './Notification.vue'
import Sticker from './Sticker.vue'

defineProps<{
  stickerId?: string
  title: string
  notificationTitle: string
  notificationDescription: string
}>()
const Confetti = defineAsyncComponent(() => import('./Confetti.vue'))
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.stickerWrapper">
      <Sticker :id="stickerId" :class="$style.sticker" />
      <Confetti />
    </div>
    <h1 :class="$style.title">
      {{ title }}
    </h1>
    <!-- TODO: i18n -->
    <p :class="$style.message">
      <slot />
    </p>
    <Notification
      :sticker-id="stickerId"
      :title="notificationTitle"
      :description="notificationDescription"
    />
  </div>
</template>

<style lang="scss" module>
.root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text);
  font-family: var(--font-sf-pro-text);
  text-align: center;
  padding: 0 32px;
  width: 100%;
}

.stickerWrapper {
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 16px;
}

.sticker {
  width: 100%;
  height: 100%;
}

.title {
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.875rem;
  letter-spacing: -0.02688rem;
}

.message {
  font-size: 1.0625rem;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: -0.02688rem;

  b {
    font-weight: 500;
  }
}
</style>
