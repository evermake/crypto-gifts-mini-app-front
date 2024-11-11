<script lang="ts" setup>
import { computed } from 'vue'
import Sticker from '~/components/Sticker.vue'
import { availabilityText, useGiftKind } from '~/composables/gifts'
import { priceToText } from '~/utils/text'

const props = defineProps<{
  kindId: string
}>()

const kindId = computed(() => props.kindId)
// TODO: Handle loading state.
const { loading: _loading, kind } = useGiftKind(kindId)
</script>

<template>
  <div v-if="kind" :class="$style.root">
    <div :class="$style.introImage">
      <div :class="[$style.image, `gift-gradient-${kind.color}`]">
        <Sticker :id="kind.stickerId" :class="$style.sticker" />
      </div>
    </div>
    <div :class="$style.introText">
      <h2 :class="$style.title">
        <span>{{ kind.name }}</span>
        <span :class="$style.chip">{{ availabilityText(kind, $t) }}</span>
      </h2>
      <h3 :class="$style.subtitle">
        {{ $t.pages.store.giftInfoText }}
      </h3>
      <div :class="$style.price">
        <span class="icon-color" :class="[`i-${kind.price.asset.toLowerCase()}-color`]" />
        <span>{{ priceToText(kind.price) }}</span>
      </div>
    </div>
    <span :class="$style.spacing" />
    <div :class="$style.actions">
      <!-- TODO -->
    </div>
  </div>
</template>

<style lang="scss" module>
.root {
  background: var(--bg);
}

.introImage {
  padding: 16px 16px 0;
}

.image {
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticker {
  width: 74%;
  height: 74%;
}

.introText {
  font-family: var(--font-sf-pro);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    display: flex;
    gap: 12px;
    align-items: center;

    & > span:not(.chip) {
      color: var(--text);
      font-size: 1.5rem;
      font-style: normal;
      font-weight: 590;
      line-height: 2rem;
    }
  }
  .chip {
    display: inline-block;
    color: var(--primary);
    background: var(--primary-transparent);
    backdrop-filter: blur(25px);
    vertical-align: middle;
    padding: 0 8px;
    border-radius: 99px;

    font-family: var(--font-sf-pro-text);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.375rem;
    letter-spacing: -0.00625rem;
  }
  .subtitle {
    color: var(--text-secondary);
    font-size: 1.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: -0.02688rem;
  }
  .price {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 8px;

    font-size: 1.0625rem;
    font-style: normal;
    font-weight: 510;
    line-height: 1.375rem;
    letter-spacing: -0.02763rem;

    :global(.icon) {
      font-size: 20px;
    }
  }
}

.spacing {
  display: block;
  width: 100%;
  height: 12px;
  background: var(--bg-secondary);

  :global(.dark) & {
    background: #000;
  }
}
</style>
