<script setup lang="ts">
import { DotLottieWorker } from '@lottiefiles/dotlottie-web'
import { computed } from 'vue'
import { giftLottieUrl, giftSvgUrl } from '~/utils/gifts'

const props = defineProps<{
  giftName: string
}>()

const src = computed(() => giftLottieUrl(props.giftName))

const lottie = new DotLottieWorker({
  src,
})
</script>

<template>
</template>

<style lang="scss" module>
</style>
