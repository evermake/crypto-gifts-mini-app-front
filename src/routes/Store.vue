<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageTitle from '~/components/PageTitle.vue'
import RouteRoot from '~/components/RouteRoot.vue'
import Sticker from '~/components/Sticker.vue'
import TgPattern from '~/components/TgPattern.vue'
import { availabilityText, useGiftKinds } from '~/composables/gifts'
import { priceToText } from '~/utils/text'

const router = useRouter()
const { kinds } = useGiftKinds()

function handleChoose(kindId: string) {
  router.push(`/store/${kindId}`)
}
</script>

<template>
  <RouteRoot :should-fade="(to) => to.name === 'gift-kind'">
    <div :class="$style.header">
      <span :class="$style.icon" class="icon i-gifts" />
      <PageTitle
        :title="$t.pages.store.title"
        :subtitle="$t.pages.store.subtitle"
      />
    </div>
    <div :class="$style.gifts">
      <div
        v-for="kind in kinds"
        :key="kind.id"
        :class="[$style.gift, `gift-gradient-${kind.color}`]"
      >
        <TgPattern :class="$style.pattern" />
        <span :class="$style.availability">
          {{ availabilityText(kind, $t) }}
        </span>
        <Sticker :id="kind.stickerId" :class="$style.sticker" />
        <h3 :class="$style.name">
          {{ kind.name }}
        </h3>
        <button :class="$style.buyBtn" @click="handleChoose(kind.id)">
          <span class="icon" :class="[`i-${kind.price.asset.toLowerCase()}`]" />
          <span>{{ priceToText(kind.price) }}</span>
        </button>
      </div>
    </div>
  </RouteRoot>
</template>

<style lang="scss" module>
.header {
  padding-top: 24px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.icon {
  color: var(--primary);
  font-size: 48px;
}

.gifts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;

  & > * {
    width: calc((100% - 12px) / 2);
    display: flex;
  }
}

.gift {
  padding: 8px 12px 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  z-index: 0;
}

.pattern {
  z-index: -1;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.availability {
  color: var(--text);
  opacity: 0.5;
  width: 100%;
  text-align: right;
  font-family: var(--font-sf-pro-text);
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 138.462% */
  letter-spacing: -0.005rem;
}

.sticker {
  margin-top: 8px;
  margin-bottom: 4px;
  width: 100%;
}

.name {
  text-align: center;
  font-family: var(--font-sf-pro-text);
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.375rem;
  letter-spacing: -0.02688rem;
  margin-bottom: 12px;
}

.buyBtn {
  background: var(--primary);
  border-radius: 99px;
  color: #fff;
  height: 30px;
  padding-left: 12px;
  padding-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: var(--font-sf-pro-text);
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.125rem;
  letter-spacing: -0.005rem;

  & :global(.icon) {
    font-size: 24px;
  }
}
</style>
