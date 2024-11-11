<script lang="ts" setup>
import { useMutation } from '@tanstack/vue-query'
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { client } from '~/api'
import Sticker from '~/components/Sticker.vue'
import TgPattern from '~/components/TgPattern.vue'
import { availabilityText, useGiftKind } from '~/composables/gifts'
import { useLocale } from '~/utils/localization'
import { priceToText } from '~/utils/text'
import { haptic } from '~/utils/tma'

const t = useLocale()
const route = useRoute()
const router = useRouter()
const kindId = computed(() => route.params.kindId as string)
const { mutate, isPending: mutating } = useMutation({
  mutationFn: async (kindId: string) => {
    Telegram.WebApp.MainButton.showProgress()
    return await client.requestPurchaseGift.mutate({ kindId })
  },
  onSuccess({ giftId: _giftId, purchaseLink }) {
    // TODO: Begin tracking payment.
    try {
      Telegram.WebApp.openTelegramLink(purchaseLink)
    }
    catch (err) {
      console.error('Failed to open purchase link', err)
      location.href = purchaseLink
    }
    router.replace('/store')
  },
  onError: (error) => {
    haptic('error')
    Telegram.WebApp.showPopup({
      title: t.value.popups.failedPurchaseGift,
      message: error.message.slice(0, 255),
      buttons: [{ type: 'close' }],
    })
  },
  onSettled: () => {
    Telegram.WebApp.MainButton.hideProgress()
  },
})

// TODO: Handle loading state.
const { loading: _loading, kind } = useGiftKind(kindId)

function handleBuy() {
  if (!mutating.value) {
    mutate(kindId.value)
  }
}
function handleBack() {
  router.go(-1)
}

onMounted(() => {
  Telegram.WebApp.SecondaryButton.hide()

  Telegram.WebApp.MainButton.onClick(handleBuy)
  Telegram.WebApp.MainButton.setParams({
    text: t.value.bottomButtons.buyGift,
    has_shine_effect: true,
    is_active: true,
    is_visible: true,
  })

  Telegram.WebApp.BackButton.onClick(handleBack)
  Telegram.WebApp.BackButton.show()
})
onUnmounted(() => {
  Telegram.WebApp.MainButton.hide()
  Telegram.WebApp.MainButton.offClick(handleBuy)

  Telegram.WebApp.BackButton.hide()
  Telegram.WebApp.BackButton.offClick(handleBack)
})
</script>

<template>
  <div v-if="kind" :class="$style.root">
    <div :class="$style.introImage">
      <div :class="[$style.image, `gift-gradient-${kind.color}`]">
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
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  box-shadow: 0 1px 4px 1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
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
