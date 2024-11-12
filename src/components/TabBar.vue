<script setup lang="ts">
import type { Tab } from '~/types'
import TabIcon from './TabIcon.vue'

const BUTTONS: Tab[] = ['store', 'gifts', 'leaderboard', 'profile']
const tab = defineModel<Tab | null>('tab', { default: null })
</script>

<template>
  <nav :class="$style.tabbar">
    <button
      v-for="btn in BUTTONS"
      :key="btn"
      :class="[$style.button, tab === btn && $style.active]"
      @click="tab = btn"
    >
      <TabIcon :tab="btn" :active="tab === btn" />
      <span :class="$style.label">{{ $t.tabbar.tab[btn] }}</span>
    </button>
  </nav>
</template>

<style module lang="scss">
.tabbar {
  padding-top: 8px;
  padding-bottom: var(--tabbar-pb);
  width: 100%;
  display: flex;
  align-items: stretch;

  background: var(--tabbar-bg);
  backdrop-filter: blur(50px);
  transition: padding-bottom ease-out 100ms;

  position: fixed;
  bottom: 0;
  left: 0;
  z-index: var(--z-tabbar);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 1px;
    background-color: var(--separator);

    @media (min-resolution: 2x) {
      height: 0.33px;
    }
  }
}

:global(:root.with-bottom-bar) .tabbar {
  display: none;
}

.button {
  flex: 1 0;
  height: 42px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--tabbar-button);
  transition: color 200ms linear;

  &.active {
    animation-name: beat;
    animation-duration: 500ms;
    animation-timing-function: ease;
    color: var(--primary);
  }
}

.label {
  font-size: 0.625rem;
  line-height: 0.75rem;
  letter-spacing: 0.00625em;
  font-weight: 500;
  text-align: center;
}

.icon {
  color: inherit;
  width: 26px;
  height: 26px;
}

@keyframes beat {
  0% {
    transform: scale(1);
  }

  36% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(1);
  }
}
</style>
