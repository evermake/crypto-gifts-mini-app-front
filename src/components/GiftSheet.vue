<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { Price } from '~/api'
import { priceToText } from '~/utils/text'
import Sticker from './Sticker.vue'

export interface Row {
  label: string
  text?: string
  price?: Price
  date?: Date
  user?: {
    id: string
    name: string
  }
}

defineProps<{
  stickerId?: string | null
  title: string
  rows: Row[]
}>()

defineEmits<{
  close: []
}>()

const StarsEffect = defineAsyncComponent(() => import('./StarsEffect.vue'))
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.backdrop" @click="$emit('close')" />
    <div :class="$style.sheet">
      <button :class="$style.close" @click="$emit('close')">
        <span class="icon i-close" />
      </button>
      <div :class="$style.giftWrapper">
        <StarsEffect :class="$style.stars" :width="500" :height="500" />
        <Sticker :id="stickerId" :class="$style.sticker" />
      </div>
      <h2 :class="$style.title">
        {{ title }}
      </h2>
      <div :class="$style.table">
        <div v-for="row in rows" :key="row.label">
          <div>{{ row.label }}</div>
          <div v-if="row.text">
            {{ row.text }}
          </div>
          <div v-else-if="row.date">
            {{ $t.misc.date(row.date) }}
          </div>
          <div v-else-if="row.price" :class="$style.rowPrice">
            <span class="icon-color" :class="[`i-${row.price.asset.toLowerCase()}-color`]" />
            <span>{{ priceToText(row.price) }}</span>
          </div>
          <div v-else-if="row.user">
            <!-- TODO: Avatar and navigation. -->
            {{ row.user.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<style lang="scss" module>
:global(.sheet-enter-from),
:global(.sheet-leave-to) {
  .sheet {
    transform: translateY(100%);
  }
  .backdrop {
    opacity: 0;
  }
}
:global(.sheet-enter-active),
:global(.sheet-leave-active) {
  .sheet {
    transition: transform 300ms ease;
  }
  .backdrop {
    transition: opacity 300ms ease;
  }
}
:global(.sheet-enter-to),
:global(.sheet-leave-from) {
  .sheet {
    transform: translateY(0);
  }
  .backdrop {
    opacity: 1;
  }
}

.root {
  z-index: var(--z-sheet);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  inset: 0;
  background-color: rgb(0 0 0 / 0.3);
}

.sheet {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 16px;
  background-color: var(--bg-secondary);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
  z-index: 1;

  --border: var(--separator);
}

.close {
  position: absolute;
  top: 12px;
  right: 16px;

  width: 30px;
  height: 30px;
  border-radius: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #e3e3e8;

  color: var(--text-secondary);
  font-size: 20px;
}

.giftWrapper {
  margin: auto;
  height: 150px;
  width: 150px;
  display: flex;
  padding: 6.25px;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
}

.stars {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: -1;
}

.sticker {
  width: 150px;
  height: 150px;
  opacity: 0;

  animation: sticker-appear 1000ms cubic-bezier(0.49, 0.4, 0.47, 1.11) 0.1s 1 forwards normal;
}

@keyframes sticker-appear {
  0% {
    opacity: 1;
    filter: blur(8px);
    transform: scale(0);
  }
  85% {
    filter: blur(0px);
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.title {
  @include t.title-1;
  text-align: center;
  margin-top: 12px;
  margin-bottom: 24px;
}

.table {
  color: var(--text);

  font-family: var(--font-sf-pro-text);
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: -0.02763rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  border-radius: 12px;
  background-color: var(--bg);

  & > * {
    display: flex;
    position: relative;

    & > *:nth-child(1) {
      flex: 0 0 32%;
      color: var(--text-secondary);
    }
    & > *:not(:last-child) {
      position: relative;

      &::after {
        content: '';
        height: 100%;
        width: 1px;
        position: absolute;
        right: 0;
        top: 0;
        background-color: var(--border);

        @media (min-resolution: 2x) {
          width: 0.33px;
        }
      }
    }
    & > * {
      display: flex;
      gap: 8px;
      align-items: center;
      padding: 8px 16px;
    }
  }
  & > *:not(:last-child) {
    &::after {
      content: '';
      height: 1px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: var(--border);

      @media (min-resolution: 2x) {
        height: 0.33px;
      }
    }
  }
}

.rowPrice {
  display: flex;
  align-items: center;
  gap: 8px;

  & > span:nth-child(1) {
    font-size: 20px;
  }

  & > span:nth-child(2) {
    font-family: var(--font-sf-pro-text);
    font-size: 1.0625rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375rem;
    letter-spacing: -0.02763rem;
  }
}

:global(.dark) {
  & .sheet {
    background-color: var(--bg);
    --border: rgb(255 255 255 / 0.2);
  }
  & .close {
    background-color: var(--bg-secondary);
  }
  & .table {
    background-color: var(--bg-secondary);
  }
}
</style>
