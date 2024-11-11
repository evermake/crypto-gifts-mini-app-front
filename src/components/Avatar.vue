<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  userId?: string
  top?: string
}>()

const avatarUrl = computed(() => (
  props.userId
    ? `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/avatars/${props.userId}`
    : null
))
</script>

<template>
  <div :class="[$style.avatar, top != null && $style.withBadge]">
    <div :class="$style.pic">
      <img v-if="avatarUrl" :src="avatarUrl" alt="">
    </div>
    <span v-if="top != null" :class="$style.badge">{{ top }}</span>
  </div>
</template>

<style lang="scss" module>
.avatar {
  width: 100px;
  height: 100px;

  &.withBadge {
    position: relative;
    height: 108px;
  }
}

.pic,
.badge {
  border-radius: 9999px;
}

.pic {
  width: 100%;
  aspect-ratio: 1;
  background: #999;
  overflow: hidden;
}

.badge {
  color: #fff;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid var(--bg);
  background: #8e8e93;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem;
  letter-spacing: 0.00625em;
  padding: 0 8px;
}
</style>
