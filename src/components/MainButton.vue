<script lang="ts" setup>
import { onActivated, onDeactivated, onMounted, onUnmounted, watchEffect } from 'vue'
import { type BottomButtonState, mainBtnState, tryTo } from '~/utils/tma'

const props = withDefaults(
  defineProps<Partial<BottomButtonState> & { text: string }>(),
  {
    active: true,
    visible: true,
    loading: false,
    shining: false,
  },
)

const emit = defineEmits<{
  click: []
}>()

watchEffect(() => {
  mainBtnState.value = {
    ...props,
  }
})

function handleClick() {
  if (props.active)
    emit('click')
}

function register() {
  mainBtnState.value.visible = true
  tryTo(app => void app.MainButton.onClick(handleClick))
}
function unregister() {
  mainBtnState.value.visible = false
  tryTo(app => void app.MainButton.offClick(handleClick))
}

onMounted(register)
onActivated(register)
onUnmounted(unregister)
onDeactivated(unregister)
</script>

<template>
  <slot />
</template>
