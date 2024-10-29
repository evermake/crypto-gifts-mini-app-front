<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import TapBar from './components/TapBar.vue'
import { en, ru } from './locales'

import { useLocalization } from './utils/localization'
import { useColorMode } from './utils/theme'

const colorMode = useColorMode()
watchEffect(() => {
  if (colorMode.value === 'dark')
    document.documentElement.classList.add('dark')
  else
    document.documentElement.classList.remove('dark')
})
const { locale, setLocale } = useLocalization()

function switchLocale() {
  setLocale(locale.value === en ? ru : en)
}

onMounted(() => {
  Telegram.WebApp.MainButton.setParams({
    color: '#000000',
    text_color: '#ffffff',
    has_shine_effect: true,
    is_active: true,
    is_visible: true,
    position: 'bottom',
    text: 'Close Me',
  })
  Telegram.WebApp.MainButton.onClick(() => {
    Telegram.WebApp.close()
  })
})
</script>

<template>
  <div>
    <h1>Hi!!!</h1>
    <button @click="switchLocale">
      switch locale
    </button>
  </div>
  <TapBar tab="store" />
</template>
