<script setup lang="ts">
import earth from '~/assets/svg/earth.svg?raw'
import gift from '~/assets/svg/gift.svg?raw'
import market from '~/assets/svg/market.svg?raw'
import profile from '~/assets/svg/profile.svg?raw'

export type Tab = 'store' | 'gifts' | 'leaderboard' | 'profile'

const tab = defineModel<Tab | null>('tab', { default: null })

const BUTTONS: { id: Tab, iconSvg: string }[] = [
  { id: 'store', iconSvg: market },
  { id: 'gifts', iconSvg: gift },
  { id: 'leaderboard', iconSvg: earth },
  { id: 'profile', iconSvg: profile },
]
</script>

<template>
  <nav :class="$style.tapbar">
    <button
      v-for="btn in BUTTONS"
      :key="btn.id"
      :class="[$style.button, tab === btn.id && $style.active]"
      @click="tab = btn.id"
    >
      <span :class="$style.icon" v-html="btn.iconSvg" />
      <span :class="$style.label">{{ $t.tapbar.tab[btn.id] }}</span>
    </button>
  </nav>
</template>

<style module lang="scss">
.tapbar {
  padding-top: 8px;
  position: fixed;
  bottom: 0;
  height: 58px;
  background: var(--tapbar-bg);
  width: 100%;
  display: flex;
  align-items: stretch;
  backdrop-filter: blur(50px);
  border-top: 0.33px solid var(--separator);
}

.button {
  flex: 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--tapbar-button);

  &.active {
    color: var(--primary);
  }
}

.label {
  font-size: 0.625rem;
  line-height: 0.75rem;
  letter-spacing: 0.00625em;
  font-weight: 500;
}

.icon {
  color: inherit;
  width: 26px;
  height: 26px;
}
</style>
