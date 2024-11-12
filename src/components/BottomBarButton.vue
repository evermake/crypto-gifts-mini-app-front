<script lang="ts" setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, watchEffect } from 'vue'
import { type BottomButtonState, mainBtnState, secondaryBtnState, tryTo } from '~/utils/tma'

const props = withDefaults(
  defineProps<Partial<BottomButtonState> & { text: string } & { secondary?: boolean }>(),
  {
    active: true,
    visible: true,
    loading: false,
    shining: false,
    secondary: false,
    position: 'top',
  },
)

const emit = defineEmits<{
  click: []
}>()

watchEffect(() => {
  if (props.secondary) {
    secondaryBtnState.value = { ...props }
  }
  else {
    mainBtnState.value = { ...props }
  }
})

function handleClick() {
  if (props.active)
    emit('click')
}

function register() {
  if (props.secondary) {
    secondaryBtnState.value.visible = true
    tryTo(app => void app.SecondaryButton.onClick(handleClick))
  }
  else {
    mainBtnState.value.visible = true
    tryTo(app => void app.MainButton.onClick(handleClick))
  }
}
function unregister() {
  if (props.secondary) {
    secondaryBtnState.value.visible = false
    tryTo(app => void app.SecondaryButton.offClick(handleClick))
  }
  else {
    mainBtnState.value.visible = false
    tryTo(app => void app.MainButton.offClick(handleClick))
  }
}

onMounted(register)
onActivated(register)
onUnmounted(unregister)
onDeactivated(unregister)
</script>

<template>
  <slot />
</template>
