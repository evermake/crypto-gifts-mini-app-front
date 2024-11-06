<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'

export type Option = 'left' | 'right'

const leftEl = useTemplateRef('leftEl')
const rightEl = useTemplateRef('rightEl')
const option = defineModel<Option>('option', { default: 'left' as Option })
const touched = ref(false)

watch(option, () => {
  setTimeout(() => {
    Telegram.WebApp.HapticFeedback.impactOccurred('soft')
  }, 75)
})

function handleClick() {
  touched.value = true
  option.value = option.value === 'left' ? 'right' : 'left'
}

const wLeft = ref<number>()
const wRight = ref<number>()
onMounted(() => {
  if (leftEl.value) {
    wLeft.value = leftEl.value.clientWidth
  }
  if (rightEl.value) {
    wRight.value = rightEl.value.clientWidth
  }
})
</script>

<template>
  <button
    :class="$style.switch"
    :data-option="option"
    :data-touched="touched ? '' : null"
    @click="handleClick"
  >
    <span ref="leftEl">
      <slot name="left" />
    </span>
    <span ref="rightEl">
      <slot name="right" />
    </span>
    <div
      :class="$style.thumb"
      :style="{
        '--_w-left': `${wLeft}px`,
        '--_w-right': `${wRight}px`,
      }"
    >
      <span>
        <slot name="left" />
      </span>
      <span>
        <slot name="right" />
      </span>
    </div>
  </button>
</template>

<style lang="scss" module>
.switch {
  --_bg-color: var(--bg-secondary);
  --_thumb-color: var(--bg);
}

:global(.dark) {
  & .switch {
    --_bg-color: #000;
    --_thumb-color: var(--bg-secondary);
  }
}

.switch {
  position: relative;
  height: 32px;
  border-radius: 99px;
  background: var(--_bg-color);
  color: var(--text-secondary);
  padding: 2px;
  display: flex;
  align-items: center;
  overflow: hidden;

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.thumb {
  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  height: calc(100% - 4px);
  top: 2px;
  left: 2px;

  border-radius: 99px;
  color: var(--text);
  background: var(--_thumb-color);
  box-shadow:
    0px 3px 8px 0px rgba(0, 0, 0, 0.12),
    0px 3px 1px 0px rgba(0, 0, 0, 0.04);

  & > span {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.switch[data-touched] .thumb {
  will-change: width, transform;
  transition:
    width 250ms ease-out,
    transform 250ms ease-out;

  & > span {
    will-change: opacity, transform;
    transition:
      opacity 250ms ease-out,
      transform 250ms ease-out;
  }
}

.switch[data-option='left'] .thumb {
  width: var(--_w-left, unset);
  transform: translateX(0);
  & > span:nth-child(2) {
    transform: scale(0);
    opacity: 0;
  }
}
.switch[data-option='right'] .thumb {
  width: var(--_w-right, unset);
  transform: translateX(var(--_w-left));
  & > span:nth-child(1) {
    transform: scale(0);
    opacity: 0;
  }
}
</style>
