<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { client, type SentGift } from '~/api'
import BottomBarButton from '~/components/BottomBarButton.vue'
import GiftMessage from '~/components/GiftMessage.vue'
import { useExtendWithKind } from '~/composables/gifts'
import { RECEIVED_GIFT_STORAGE_KEY, REDEEMED_GIFT_ID_STORAGE_KEY } from '~/utils/misc'

const router = useRouter()
const extendWithKind = useExtendWithKind()

const receivedGiftRaw = localStorage.getItem(RECEIVED_GIFT_STORAGE_KEY)
let receivedGift: null | SentGift = null
if (!receivedGiftRaw) {
  router.back()
}
else {
  receivedGift = JSON.parse(receivedGiftRaw)
  sessionStorage.setItem(REDEEMED_GIFT_ID_STORAGE_KEY, receivedGift?.id ?? '')
}

const extended = computed(() => receivedGift ? extendWithKind.value(receivedGift) : null)
const { data: sender } = useQuery({
  queryKey: ['user', computed(() => extended.value?.senderId)],
  queryFn: async ({ queryKey }) => {
    const id = queryKey[1]
    if (!id)
      return null
    return await client.user.query({ userId: id })
  },
})
</script>

<template>
  <div v-if="extended" :class="$style.page">
    <GiftMessage
      :title="$t.pages.giftReceived.title"
      :sticker-id="extended.kind.stickerId ?? undefined"
      :notification-title="$t.pages.giftReceived.title"
      :notification-description="$t.pages.giftReceived.giftFrom(extended.kind.name, sender?.name ?? '...')"
    >
      You have received the gift <b>{{ extended.kind.name }}</b>.
    </GiftMessage>

    <BottomBarButton
      :text="$t.bottomButtons.openProfile"
      @click="$router.replace({ name: 'me' })"
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
