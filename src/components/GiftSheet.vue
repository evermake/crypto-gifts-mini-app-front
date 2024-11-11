<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Sticker from './Sticker.vue'

defineProps<{
  stickerId?: string | null
  title: string
}>()

defineEmits<{
  close: []
}>()

const StarsEffect = defineAsyncComponent(() => import('./StarsEffect.vue'))
</script>

<template>
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
      <div>
        <div>{{ $t.giftInfo.from }}</div>
        <div>Alicia</div>
      </div>
      <div>
        <div>{{ $t.giftInfo.date }}</div>
        <div>06.10.24 at 00:04</div>
      </div>
      <div>
        <div>{{ $t.giftInfo.price }}</div>
        <div>10 USDT</div>
      </div>
      <div>
        <div>{{ $t.giftInfo.availability }}</div>
        <div>3 of 10 000</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
.sheet {
  z-index: 5;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 16px;
  background-color: var(--bg-secondary);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;

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
  z-index: -1;
}

.sticker {
  width: 150px;
  height: 150px;

  animation: sticker-appear 1000ms cubic-bezier(0.49, 0.4, 0.47, 1.11) 0.1s 1 forwards normal;
}

@keyframes sticker-appear {
  0% {
    visibility: hidden;
  }
  1% {
    filter: blur(8px);
    transform: scale(0);
  }
  85% {
    filter: blur(0px);
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.title {
  @include t.title-1;
  text-align: center;
  margin-top: 12px;
  margin-bottom: 24px;
}

.table {
  @include t.body;
  color: var(--text);

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
