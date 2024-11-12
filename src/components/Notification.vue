<script lang="ts" setup>
import Sticker from './Sticker.vue'

defineProps<{
  stickerId?: string
  title?: string
  description?: string
}>()
</script>

<template>
  <div :class="$style.notification">
    <div :class="$style.leading">
      <Sticker :id="stickerId" :class="$style.sticker" />
      <div :class="$style.text">
        <span :class="$style.title">{{ title }}</span>
        <span :class="$style.description">{{ description }}</span>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.notification {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 16px;
  border-radius: 14px;
  background: var(--notification-bg);
  backdrop-filter: blur(10px);
  animation:
    500ms cubic-bezier(0.3, 0, 0.3, 1.15) 0s 1 forwards slide-up,
    350ms ease-in 5s 1 forwards disappear;

  position: fixed;
  bottom: 16px;
  left: 16px;
  right: 16px;
  z-index: var(--z-notification);
}

.sticker {
  height: 28px;
  width: 28px;
  margin-right: 12px;
}

@keyframes disappear {
  0% {
    transform: scale(1);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.85);
    filter: blur(4px);
    opacity: 0;
  }
}

@keyframes slide-up {
  0% {
    transform: translateY(calc(100% + 68px));
  }
  100% {
    transform: translateY(0px);
  }
}

.leading {
  display: flex;
  align-items: center;
}

.text {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-family: var(--font-sf-pro);
}

.title {
  font-size: 0.875rem;
  font-weight: 590;
  line-height: 1.125rem;
  letter-spacing: -0.00963rem;
}

.description {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.00963rem;
}
</style>
