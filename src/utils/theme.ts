import type { TelegramWebApps } from 'telegram-webapps'
import { useLocalStorage } from '@vueuse/core'
import { computed, inject, type InjectionKey, type Plugin, shallowRef, type ShallowRef } from 'vue'

export type ColorMode = 'system' | 'dark' | 'light'
export type MiniAppTheme = TelegramWebApps.ThemeParams
export type MiniAppColorMode = TelegramWebApps.ColorScheme

export const APPEARANCE_INJECTION_KEY = Symbol('theme') as InjectionKey<{
  theme: ShallowRef<MiniAppTheme>
  preferredColorMode: ShallowRef< ColorMode>
  colorMode: ShallowRef<Exclude<ColorMode, 'system'>>
  toggleColorMode: () => void
}>

export function useAppearance() {
  return inject(APPEARANCE_INJECTION_KEY)!
}

export function useColorMode() {
  const { colorMode } = useAppearance()
  return colorMode
}

export const appearance: Plugin = (app) => {
  const appColorMode = shallowRef<MiniAppColorMode>(Telegram.WebApp.colorScheme)
  const appTheme = shallowRef<MiniAppTheme>(Telegram.WebApp.themeParams)
  const preferredColorMode = useLocalStorage<ColorMode>('color-mode', appColorMode)

  const handleThemeChange = () => {
    appColorMode.value = Telegram.WebApp.colorScheme
    appTheme.value = Telegram.WebApp.themeParams
  }

  Telegram.WebApp.onEvent('themeChanged', handleThemeChange)
  app.onUnmount(() => {
    Telegram.WebApp.offEvent('themeChanged', handleThemeChange)
  })

  const colorMode = computed(() => {
    if (preferredColorMode.value === 'system')
      return appColorMode.value
    return preferredColorMode.value
  })

  const toggleColorMode = () => {
    if (colorMode.value !== appColorMode.value) {
      // User wants to set a mode that matches the device's one.
      preferredColorMode.value = 'system'
    }
    else {
      preferredColorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  }

  app.provide(APPEARANCE_INJECTION_KEY, {
    colorMode,
    preferredColorMode,
    theme: appTheme,
    toggleColorMode,
  })
}
