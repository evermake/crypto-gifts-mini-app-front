import type { TelegramWebApps } from 'telegram-webapps'
import { useLocalStorage } from '@vueuse/core'
import { computed, inject, type InjectionKey, type Plugin, shallowRef, type ShallowRef, watchEffect } from 'vue'
import { DARK_MODE_BG_COLOR, DARK_MODE_HEADER_COLOR, LIGHT_MODE_BG_COLOR, LIGHT_MODE_HEADER_COLOR } from '~/config'

export type ColorMode = 'system' | 'dark' | 'light'
export type ResolvedColorMode = 'dark' | 'light'
export type MiniAppTheme = TelegramWebApps.ThemeParams
export type MiniAppColorMode = TelegramWebApps.ColorScheme

export const APPEARANCE_INJECTION_KEY = Symbol('theme') as InjectionKey<{
  theme: ShallowRef<MiniAppTheme>
  preferredColorMode: ShallowRef< ColorMode>
  colorMode: ShallowRef<Exclude<ColorMode, 'system'>>
  setColorMode: (target: ResolvedColorMode) => void
  platform: TelegramWebApps.WebApp['platform']
}>

export function useAppearance() {
  return inject(APPEARANCE_INJECTION_KEY)!
}

export function useColorMode() {
  const { colorMode } = useAppearance()
  return colorMode
}

function setupMiniAppColors(colorMode: ResolvedColorMode) {
  Telegram.WebApp.setHeaderColor(colorMode === 'dark' ? DARK_MODE_HEADER_COLOR : LIGHT_MODE_HEADER_COLOR)
  Telegram.WebApp.setBackgroundColor(colorMode === 'dark' ? DARK_MODE_BG_COLOR : LIGHT_MODE_BG_COLOR)
}

export const appearance: Plugin = (app) => {
  const appColorMode = shallowRef<MiniAppColorMode>(Telegram.WebApp.colorScheme)
  const appTheme = shallowRef<MiniAppTheme>(Telegram.WebApp.themeParams)
  const preferredColorMode = useLocalStorage<ColorMode>('color-mode', 'system')

  const handleThemeChange = () => {
    appColorMode.value = Telegram.WebApp.colorScheme
    appTheme.value = Telegram.WebApp.themeParams
  }

  Telegram.WebApp.onEvent('themeChanged', handleThemeChange)
  app.onUnmount(() => {
    Telegram.WebApp.offEvent('themeChanged', handleThemeChange)
  })

  const colorMode = computed<ResolvedColorMode>(() => {
    if (preferredColorMode.value === 'system')
      return appColorMode.value
    return preferredColorMode.value
  })

  const setColorMode = (target: ResolvedColorMode) => {
    if (target === appColorMode.value) {
      preferredColorMode.value = 'system'
    }
    else {
      preferredColorMode.value = target
    }
  }

  watchEffect(() => {
    if (colorMode.value === 'dark')
      document.documentElement.classList.add('dark')
    else
      document.documentElement.classList.remove('dark')

    setupMiniAppColors(colorMode.value)
  })

  const platform = Telegram.WebApp.platform
  document.documentElement.classList.add(`platform-${platform}`)

  setTimeout(() => {
    setupMiniAppColors(colorMode.value)
  }, 0)

  app.provide(APPEARANCE_INJECTION_KEY, {
    colorMode,
    preferredColorMode,
    theme: appTheme,
    setColorMode,
    platform,
  })
}
