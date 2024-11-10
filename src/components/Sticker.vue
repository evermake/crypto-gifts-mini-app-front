<script lang="ts" setup>
import { computed } from 'vue'
import { giftSvgUrl } from '~/utils/gifts'

const props = defineProps<{
  giftName: string
}>()
const svgUrl = computed(() => giftSvgUrl(props.giftName))
</script>

<template>
  <div
    :class="$style.gift"
    :style="{
      ...(svgUrl ? { '--svg-url': `url('${svgUrl}')` } : {}),
    }"
  />
</template>

<style lang="scss" module>
.gift {
  background-image: var(--svg-url);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
