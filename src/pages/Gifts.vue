<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { shallowRef } from 'vue'
import type { SendableGift } from '~/api'
import { client } from '~/api'
import EmptyBlock from '~/components/EmptyBlock.vue'
import PageTitle from '~/components/PageTitle.vue'

const { data: gifts } = useQuery({
  queryKey: ['my-sendable-gifts'],
  queryFn: async () => {
    return await client.mySendableGifts.query()
  },
})

const selected = shallowRef<SendableGift | null>(null)

function openStore() {}
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
      <div v-for="gift in gifts" :key="gift.id">
        <span>kind: {{ gift.kindId }}</span>
        <span>order: {{ gift.order }}</span>
        <span>Date: {{ gift.purchaseDate }}</span>
        <span>Price: {{ JSON.stringify(gift.purchasePrice) }}</span>
        <button @click="send(gift.id)">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.titles {
  padding-top: 24px;
  margin-bottom: 16px;
}

.empty {
  padding: 16px;
}

.gifts {
  display: flex;
  flex-direction: column;
  padding: 16px 8px 8px;

  & > * {
    display: flex;
    flex-direction: column;
  }
}
</style>
