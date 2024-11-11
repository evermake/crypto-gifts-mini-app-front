<script lang="ts" setup>
import { computed, defineAsyncComponent, ref } from 'vue'

const props = defineProps<{
  id?: string | null
}>()

const StickerLottie = defineAsyncComponent(() => import('./StickerLottie.vue'))
const lottieReady = ref(false)
const isStar = computed(() => {
  switch (props.id) {
    case 'gift-red-star': return true
    case 'gift-green-star': return true
    case 'gift-blue-star': return true
  }
  return false
})

let baseUrl = import.meta.env.BASE_URL
baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
const svgPath = computed(() => props.id ? `${baseUrl}/stickers/${props.id}.svg` : null)
const lottiePath = computed(() => props.id ? `${baseUrl}/stickers/${props.id}.json` : null)
const lottieUrl = computed(() => (
  lottiePath.value
    ? new URL(lottiePath.value, document.baseURI).href
    : null
))
</script>

<template>
  <div
    :class="$style.sticker"
    :style="{
      ...(svgPath ? { '--svg-url': `url('${svgPath}')` } : {}),
    }"
  >
    <div
      v-show="!lottieReady"
      :class="$style.svg"
    />
    <StickerLottie
      :class="$style.lottie"
      :src="lottieUrl"
      :data-visible="lottieReady ? '' : null"
      :is-star="isStar"
      @ready="lottieReady = true"
    />
  </div>
</template>

<style lang="scss" module>
.sticker {
  aspect-ratio: 1;
  position: relative;
}

.svg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: var(--svg-url);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.lottie {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  &:not([data-visible]) {
    visibility: hidden;
  }
}
</style>
