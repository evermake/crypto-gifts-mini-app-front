<script setup lang="ts">
import { useMutation, useQuery } from '@tanstack/vue-query'
import { client } from '~/api'
import PageTitle from '~/components/PageTitle.vue'
import Sticker from '~/components/Sticker.vue'
import { priceToText, shortenNumber } from '~/utils/text'

const { data: kinds } = useQuery({
  queryKey: ['gift-kinds'],
  queryFn: async () => {
    return await client.giftKinds.query()
  },
})

const { mutate: requestPurchase } = useMutation({
  mutationFn: async (kindId: string) => {
    return await client.requestPurchaseGift.mutate({ kindId })
  },
})

function buy(id: string) {}

function colorByKindName(name: string) {
  name = name.toLowerCase()
  switch (true) {
    case name.includes('red'): return 'red'
    case name.includes('green'): return 'green'
    case name.includes('blue'): return 'blue'
  }
  return 'gold'
}
</script>

<template>
  <div>
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
        :class="$style.gift"
        :data-color="colorByKindName(kind.name)"
      >
        <span :class="$style.availability">
          {{ shortenNumber(kind.limit - kind.inStock) }} {{ $t.misc.of }} {{ shortenNumber(kind.limit) }}
        </span>
        <Sticker :class="$style.sticker" :gift-name="kind.name" />
        <h3 :class="$style.name">
          {{ kind.name }}
        </h3>
        <button :class="$style.buyBtn">
          <span class="icon" :class="[`i-${kind.price.asset.toLowerCase()}`]" />
          <span>{{ priceToText(kind.price) }}</span>
        </button>
      </div>
    </div>
  </div>
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

  &[data-color='gold'] {
    background: linear-gradient(180deg, rgba(254, 159, 65, 0.2) 0%, rgba(254, 159, 65, 0.1) 100%);
  }
  &[data-color='red'] {
    background: linear-gradient(180deg, rgba(255, 71, 71, 0.2) 0%, rgba(255, 71, 71, 0.05) 100%);
  }
  &[data-color='green'] {
    background: linear-gradient(180deg, rgba(70, 209, 0, 0.2) 0%, rgba(70, 209, 0, 0.06) 100%);
  }
  &[data-color='blue'] {
    background: linear-gradient(180deg, rgba(0, 122, 255, 0.2) 0%, rgba(0, 122, 255, 0.05) 100%);
  }
}

.availability {
  color: var(--text);
  opacity: 0.5;
  width: 100%;
  text-align: right;
  font-family: var(--sf-pro-text);
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 138.462% */
  letter-spacing: -0.005rem;
}

.sticker {
  margin-top: 8px;
  margin-bottom: 4px;
}

.name {
  text-align: center;
  font-family: var(--sf-pro-text);
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

  font-family: var(--sf-pro-text);
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
