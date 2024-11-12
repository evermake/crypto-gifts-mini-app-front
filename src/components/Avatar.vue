<script setup lang="ts">
import { computed } from 'vue'
import UserPic from './UserPic.vue'

const props = defineProps<{
  userId?: string
  name?: string
  rank?: number
}>()

const userId = computed(() => props.userId)

// TODO: Show gradient and letters.
</script>

<template>
  <div :class="[$style.avatar, rank != null && $style.withBadge]">
    <UserPic
      :class="$style.pic"
      :user-id="userId"
      :name="name"
    />
    <span v-if="rank != null" :class="[$style.badge, rank === 1 && $style.top1]">
      {{ typeof rank === 'number' ? `#${rank}` : '—' }}
    </span>
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

.badge {
  border-radius: 9999px;
}

.pic {
  width: 100%;
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

  &.top1 {
    background: var(--gold);
  }
}
</style>
