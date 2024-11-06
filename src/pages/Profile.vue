<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '~/components/Avatar.vue'
import Notification from '~/components/Notification.vue'
import type { Option } from '~/components/Switch.vue'
import Switch from '~/components/Switch.vue'
import { en, ru } from '~/locales'
import { useAppearance } from '~/utils/appearance'
import { useLocalization } from '~/utils/localization'

const NAME = 'Alicia'
const N = 1234
const PREM = true

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
    <div :class="$style.switches">
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
      <Avatar :top="160" />
      <div :class="$style.titles">
        <h1 :class="$style.title">
          {{ NAME }}
          <span v-if="PREM" class="icon i-premium" />
        </h1>
        <h3 :class="$style.subtitle">
          {{ $t.pages.profile.giftsReceived(N) }}
        </h3>
      </div>
    </div>
    <Notification title="Gift Received" description="Delicious Cake from Mark.">
      <template #trailing>
        <span>View</span>
      </template>
    </Notification>
    <div :class="$style.gifts" />
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
