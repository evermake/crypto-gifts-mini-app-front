<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { SendableGift } from '~/api'
import BottomBarButton from '~/components/BottomBarButton.vue'
import GiftMessage from '~/components/GiftMessage.vue'
import { useExtendWithKind } from '~/composables/gifts'
import { PURCHASED_GIFT_STORAGE_KEY } from '~/utils/misc'
import { priceToText } from '~/utils/text'

const router = useRouter()
const extendWithKind = useExtendWithKind()

const purchasedGiftRaw = localStorage.getItem(PURCHASED_GIFT_STORAGE_KEY)
let purchasedGift: null | SendableGift = null
if (!purchasedGiftRaw) {
  router.back()
}
else {
  purchasedGift = JSON.parse(purchasedGiftRaw)
}

const extended = computed(() => purchasedGift ? extendWithKind.value(purchasedGift) : null)
</script>

<template>
  <div v-if="extended" :class="$style.page">
    <GiftMessage
      :title="$t.pages.giftPurchased.title"
      :sticker-id="extended.kind.stickerId ?? undefined"
      :notification-title="$t.pages.giftPurchased.youBoughtGift"
      :notification-description="$t.pages.giftPurchased.nowSend"
    >
      The <b>{{ extended.kind.name }}</b> gift was purchased for <b>{{ priceToText(extended.purchasePrice) }}</b>.
    </GiftMessage>

    <BottomBarButton
      :text="$t.bottomButtons.sendGift"
      position="top"
      @click="$router.replace({ name: 'gifts' })"
    />
    <BottomBarButton
      :text="$t.bottomButtons.openStore"
      position="bottom"
      secondary
      @click="$router.replace({ name: 'store' })"
    />
  </div>
</template>

<style module lang="scss">
.page {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
