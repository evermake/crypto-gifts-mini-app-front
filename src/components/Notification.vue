<script lang="ts" setup>
defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div :class="$style.notification">
    <div :class="$style.leading">
      <slot name="leading" />
      <div :class="$style.text">
        <span v-if="title" :class="$style.title">{{ title }}</span>
        <span v-if="description">{{ description }}</span>
      </div>
    </div>
    <slot name="trailing">
      <span />
    </slot>
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
  // animation: 500ms cubic-bezier(0.3, 0, 0.3, 1.15) 0s 1 forwards slide-up;
  // animation: 350ms ease-in 2s 1 forwards disappear;

  position: fixed;
  bottom: 74px;
  left: 16px;
  right: 16px;
  z-index: var(--z-notification);
}

@keyframes disappear {
  0% {
    transform: scale(1);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
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
}

.text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem;
  letter-spacing: -0.00963rem;
}

.title {
  font-weight: 590;
}
</style>
