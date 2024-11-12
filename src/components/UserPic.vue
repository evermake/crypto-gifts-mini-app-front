<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  userId?: string
  name?: string
}>()

const userId = computed(() => props.userId)

const avatarUrl = computed(() => (
  userId.value
    ? `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/avatars/${userId.value}`
    : null
))

function getAvatarLetters(name: string) {
  if (!name || typeof name !== 'string')
    return ''

  const words = name.trim().split(/\s+/).filter(Boolean)

  const firstLetter = words[0]?.charAt(0).toUpperCase() || ''

  const secondLetter = words.length > 1
    ? words[words.length - 1].charAt(0).toUpperCase()
    : (words[0]?.charAt(1) || '').toUpperCase()

  return `${firstLetter}${secondLetter}`.trim()
}

const letters = computed(() => getAvatarLetters(props.name ?? ''))
</script>

<template>
  <div
    :class="$style.pic"
    :style="{
      ...(avatarUrl ? { '--avatar': `url('${avatarUrl}.jpeg')` } : undefined),
    }"
  >
    <div :class="$style.mainBg" />
    <div :class="$style.fallbackBg">
      <span>{{ letters }}</span>
    </div>
  </div>
</template>

<style lang="scss" module>
.pic {
  border-radius: 9999px;
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
  isolation: isolate;
}

.mainBg,
.fallbackBg {
  position: absolute;
  inset: 0;
}

.mainBg {
  background: var(--avatar) no-repeat;
  background-position: center;
  background-size: cover;
  z-index: 2;
}

.fallbackBg {
  background: linear-gradient(0deg, rgba(0, 101, 255, 1) 0%, rgba(86, 153, 255, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  container-type: inline-size;

  & > span {
    color: #fff;
    font-family: var(--font-sf-pro);
    font-size: 40cqw;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0;
  }
}
</style>
