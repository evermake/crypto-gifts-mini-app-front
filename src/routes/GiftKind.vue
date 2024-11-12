<script lang="ts" setup>
import { useMutation } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { client } from '~/api'
import BottomBarButton from '~/components/BottomBarButton.vue'
import RouteRoot from '~/components/RouteRoot.vue'
import Sticker from '~/components/Sticker.vue'
import TgPattern from '~/components/TgPatternAsync'
import { availabilityText, useGiftKind } from '~/composables/gifts'
import { useLocale } from '~/utils/localization'
import { PURCHASED_GIFT_STORAGE_KEY } from '~/utils/misc'
import { waitForPurchase } from '~/utils/monitor-purchase'
import { priceToText } from '~/utils/text'
import { showError } from '~/utils/tma'

const t = useLocale()
const route = useRoute()
const router = useRouter()
const kindId = computed(() => route.params.kindId as string)
const { mutate, isPending: mutating } = useMutation({
  mutationFn: async (kindId: string) => {
    return await client.requestPurchaseGift.mutate({ kindId })
  },
  onSuccess({ giftId, purchaseLink }) {
    waitForPurchase(giftId)
      .then((purchasedGift) => {
        // FIXME: Not a clever way.
        localStorage.setItem(PURCHASED_GIFT_STORAGE_KEY, JSON.stringify(purchasedGift))
        router.push({ name: 'gift-purchased' })
      })
      .catch((err) => {
        console.error('Failed to wait for purchase:', err)
      })
    try {
      Telegram.WebApp.openTelegramLink(purchaseLink)
    }
    catch (err) {
      console.error('Failed to open purchase link', err)
      location.href = purchaseLink
    }
  },
  onError: (error) => {
    showError({
      title: t.value.popups.failedPurchaseGift,
      message: error.message,
    })
  },
})

// TODO: Handle loading state.
const { loading: _loading, kind } = useGiftKind(kindId)

function handleBuy() {
  if (!mutating.value) {
    mutate(kindId.value)
  }
}
</script>

<template>
  <RouteRoot
    v-if="kind"
    :class="$style.root"
    :should-fade="(to) => to.name === 'store'"
  >
    <div :class="$style.introImage">
      <div :class="[$style.image, `gradient-${kind.color}`]">
        <TgPattern :class="$style.pattern" />
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
    <BottomBarButton
      :text="$t.bottomButtons.buyGift"
      :loading="mutating"
      active
      shining
      @click="handleBuy"
    />
  </RouteRoot>
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
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient);
}

.pattern {
  position: absolute;
  width: 100%;
  height: auto;
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
    padding-right: 32px;
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
