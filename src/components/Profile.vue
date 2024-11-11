<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { client } from '~/api'
import Avatar from '~/components/Avatar.vue'
import Sticker from '~/components/Sticker.vue'
import type { Option } from '~/components/Switch.vue'
import Switch from '~/components/Switch.vue'
import { availabilityText, useExtendWithKind } from '~/composables/gifts'
import { useAppearance } from '~/utils/appearance'
import { useLocalization } from '~/utils/localization'
import EmptyBlock from './EmptyBlock.vue'

const props = defineProps<{
  me?: boolean
  userId?: string
}>()

const router = useRouter()

const userId = computed(() => {
  if (props.me)
    return 'me'
  if (!props.userId)
    console.warn('userId property is required if me is not set')
  return props.userId ?? ''
})

const isMyPage = computed(() => userId.value === 'me')

const { data: userData } = useQuery({
  queryKey: ['user', userId],
  queryFn: async ({ queryKey }) => {
    const userId = queryKey[1]
    if (userId === 'me')
      return await client.me.query()
    return await client.user.query({ userId })
  },
})

const { data: giftsRaw } = useQuery({
  queryKey: ['user-gifts', userId],
  queryFn: async ({ queryKey }) => {
    const userId = queryKey[1]
    if (userId === 'me')
      return await client.userGifts.query({ my: true })
    return await client.userGifts.query({ userId })
  },
})
const extendWithKind = useExtendWithKind()
const gifts = computed(() => (
  giftsRaw.value
    ? giftsRaw.value.map(extendWithKind)
    : null
))

const { colorMode, setColorMode } = useAppearance()
const { localeKey, setLocale } = useLocalization()

const themeOption = computed<Option>({
  get: () => {
    return colorMode.value === 'light' ? 'left' : 'right'
  },
  set: (newOption) => {
    setColorMode(newOption === 'left' ? 'light' : 'dark')
  },
})
const localeOption = computed<Option>({
  get: () => {
    return localeKey.value === 'ru' ? 'right' : 'left'
  },
  set: (newOption) => {
    setLocale(newOption === 'left' ? 'en' : 'ru')
  },
})

function openStore() {
  router.replace('/store')
}
</script>

<template>
  <div :class="$style.page">
    <div v-if="isMyPage" :class="$style.switches">
      <Switch v-model:option="themeOption">
        <template #left>
          <span :class="$style.switchThemeItem" class="icon i-sun" />
        </template>
        <template #right>
          <span :class="$style.switchThemeItem" class="icon i-moon" />
        </template>
      </Switch>
      <Switch v-model:option="localeOption">
        <template #left>
          <span :class="$style.switchLangItem">EN</span>
        </template>
        <template #right>
          <span :class="$style.switchLangItem">RU</span>
        </template>
      </Switch>
    </div>

    <div :class="$style.profile">
      <Avatar
        top="—"
        :user-id="userData?.id"
      />
      <div :class="$style.titles">
        <h1 :class="$style.title">
          {{ userData?.name }}
          <span v-if="userData?.isPremium" class="icon i-premium" />
        </h1>
        <h3 :class="$style.subtitle">
          {{ $t.pages.profile.giftsReceived(userData?.receivedGiftsCount ?? 0) }}
        </h3>
      </div>
    </div>

    <div v-if="me && gifts && gifts.length === 0" :class="$style.emptyWrapper">
      <EmptyBlock
        :title="$t.pages.profile.noGifts"
        :action-label="$t.pages.profile.openStore"
        @action="openStore"
      />
    </div>
    <div v-else-if="gifts" :class="$style.gifts">
      <!-- TODO: Implement virtualization. -->
      <div v-for="gift in gifts" :key="gift.id" :class="$style.gift">
        <!-- TODO: Add avatar. -->
        <span gift-availability>
          {{ availabilityText(gift.kind, $t, true) }}
        </span>

        <Sticker :id="gift.kind.stickerId" :class="$style.sticker" />

        <span gift-name>{{ gift.kind.name }}</span>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.page {
  position: relative;
}

.emptyWrapper {
  padding: 24px 16px;
}

.switches {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 6px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switchThemeItem {
  font-size: 21px;
  width: 36px;
  margin: 0 8px;
}
.switchLangItem {
  font-size: 0.875rem;
  font-weight: 590;
  letter-spacing: -0.02563rem;
  padding: 0 10px;
}

.profile {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  gap: 12px;
}

.gifts {
  gap: 8px;
  padding: 24px 16px 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
}

.gift {
  padding: 8px 12px 12px;
  background: var(--bg-secondary);
  border-radius: 12px;
  font-family: var(--font-sf-pro-text);
  display: flex;
  flex-direction: column;

  [gift-availability] {
    text-align: right;
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.125rem;
    letter-spacing: -0.005rem;
  }

  .sticker {
    margin-top: 4px;
    margin-bottom: 20px;
    width: 80px;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
  }

  [gift-name] {
    color: var(--text);
    text-align: center;
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.125rem;
    letter-spacing: -0.02763rem;
  }
}

.titles {
  text-align: center;
}

.title {
  @include t.title-1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;

  & :global(.icon) {
    color: var(--primary);
  }
}

.subtitle {
  @include t.body;
  color: var(--text-secondary);
}
</style>
