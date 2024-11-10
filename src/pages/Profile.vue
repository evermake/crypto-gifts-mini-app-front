<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { client } from '~/api'
import Avatar from '~/components/Avatar.vue'
import GiftIcon from '~/components/Sticker.vue'
import type { Option } from '~/components/Switch.vue'
import Switch from '~/components/Switch.vue'
import { en, ru } from '~/locales'
import { useAppearance } from '~/utils/appearance'
import { useLocalization } from '~/utils/localization'

const props = defineProps<{
  me?: boolean
  userId?: string
}>()

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

const { data: gifts } = useQuery({
  queryKey: ['user-gifts', userId],
  queryFn: async ({ queryKey }) => {
    const userId = queryKey[1]
    if (userId === 'me')
      return await client.userGifts.query({ my: true })
    return await client.userGifts.query({ userId })
  },
})

const { colorMode, setColorMode } = useAppearance()
const { locale, setLocale } = useLocalization()

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
    return locale.value === ru ? 'right' : 'left'
  },
  set: (newOption) => {
    setLocale(newOption === 'left' ? en : ru)
  },
})
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
      <Avatar :top="10101" />
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

    <!-- TODO: Implement virtualization. -->
    <div :class="$style.gifts">
      <div v-for="gift in gifts" :key="gift.id" :class="$style.gift">
        <GiftIcon gift-name="Delicious Cake" />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.page {
  position: relative;
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
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 24px 16px 16px;
}

.gift {
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
