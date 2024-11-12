<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import type { SendableGift } from '~/api'
import { client } from '~/api'
import BottomBarButton from '~/components/BottomBarButton.vue'
import EmptyBlock from '~/components/EmptyBlock.vue'
import GiftSheet from '~/components/GiftSheet.vue'
import PageTitle from '~/components/PageTitle.vue'
import Sticker from '~/components/Sticker.vue'
import type { WithKind } from '~/composables/gifts'
import { useExtendWithKind } from '~/composables/gifts'
import { haptic } from '~/utils/tma'

const router = useRouter()
const { data: giftsRaw } = useQuery({
  queryKey: ['my-sendable-gifts'],
  queryFn: async () => {
    return await client.mySendableGifts.query()
  },
})
const extendWithKind = useExtendWithKind()
const gifts = computed(() => giftsRaw.value?.map(extendWithKind.value))

const chosenGift = shallowRef<null | WithKind<SendableGift>>(null)

function handleChoose(giftId: string) {
  const gift = gifts.value?.find(({ id }) => giftId === id)
  if (!gift)
    return

  haptic('light')
  chosenGift.value = gift
}

function openStore() {
  router.replace('/store')
}

function handleSend() {
  if (chosenGift.value) {
    try {
      ((window as any).Telegram.WebView).postEvent(
        'web_app_switch_inline_query',
        false,
        { query: chosenGift.value.sendToken, chat_types: ['users'] },
      )
    }
    catch (err) {
      console.error('Failed to switch to inline query:', err)
    }
  }
}
</script>

<template>
  <div>
    <PageTitle
      :class="$style.titles"
      :title="$t.pages.gifts.title"
      :subtitle="$t.pages.gifts.subtitle"
    />
    <div
      v-if="gifts && gifts.length === 0"
      :class="$style.empty"
    >
      <EmptyBlock
        :title="$t.pages.gifts.noGifts"
        :action-label="$t.pages.gifts.openStore"
        @action="openStore"
      />
    </div>
    <div
      v-else-if="gifts"
      :class="$style.gifts"
    >
      <div
        v-for="gift in gifts"
        :key="gift.id"
        :class="$style.gift"
      >
        <h5 :class="$style.name">
          {{ gift.kind.name }}
        </h5>
        <Sticker :id="gift.kind.stickerId" :class="$style.sticker" />
        <button :class="$style.sendBtn" @click="handleChoose(gift.id)">
          {{ $t.pages.gifts.send }}
        </button>
      </div>
    </div>

    <Transition name="sheet" :duration="300">
      <GiftSheet
        v-if="chosenGift"
        :sticker-id="chosenGift.kind.stickerId"
        :title="$t.pages.gifts.sendGift"
        :rows="[
          { label: $t.table.gift, text: chosenGift.kind.name },
          { label: $t.table.date, date: new Date(chosenGift.purchaseDate) },
          { label: $t.table.price, price: chosenGift.purchasePrice },
          { label: $t.table.availability, text: `${chosenGift.order} ${$t.misc.of} ${chosenGift.kind.limit}` },
        ]"
        @close="chosenGift = null"
      />
    </Transition>

    <BottomBarButton
      v-if="chosenGift"
      :text="$t.bottomButtons.sendGiftToContact"
      @click="handleSend"
    />
  </div>
</template>

<style lang="scss" module>
.titles {
  padding-top: 24px;
  padding-bottom: 24px;
}

.empty {
  padding: 8px 16px;
}

.gifts {
  padding: 8px 16px 8px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 8px;
}

.gift {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 8px 16px 12px;
  font-family: var(--font-sf-pro-text);
  display: flex;
  flex-direction: column;

  .name {
    color: var(--text-secondary);
    margin-bottom: 4px;
    text-align: center;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    letter-spacing: -0.005rem;
  }

  .sticker {
    width: 80px;
    height: 80px;
    margin: auto;
  }

  .sendBtn {
    margin-top: 8px;
    padding: 6px 16px;
    border-radius: 99px;
    width: 100%;
    background: var(--primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 0.8125rem;
    font-style: normal;
    font-weight: 600;
    line-height: 1.125rem;
    letter-spacing: -0.005rem;
  }
}
</style>
