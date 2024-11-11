<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { client } from '~/api'
import EmptyBlock from '~/components/EmptyBlock.vue'
import PageTitle from '~/components/PageTitle.vue'
import Sticker from '~/components/Sticker.vue'
import { useExtendWithKind } from '~/composables/gifts'

const { data: giftsRaw } = useQuery({
  queryKey: ['my-sendable-gifts'],
  queryFn: async () => {
    return await client.mySendableGifts.query()
  },
})
const extendWithKind = useExtendWithKind()
const gifts = computed(() => giftsRaw.value?.map(extendWithKind))

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
      <div
        v-for="gift in gifts"
        :key="gift.id"
        :class="$style.gift"
      >
        <h5 :class="$style.name">
          {{ gift.kind.name }}
        </h5>
        <Sticker :id="gift.kind.stickerId" :class="$style.sticker" />
        <button :class="$style.sendBtn">
          {{ $t.pages.gifts.send }}
        </button>
      </div>
    </div>
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
  padding: 16px 8px 8px;
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
