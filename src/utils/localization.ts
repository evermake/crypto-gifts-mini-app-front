import type { InjectionKey, Plugin, ShallowRef } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { computed, inject } from 'vue'
import { type Locale, type LocaleKey, LOCALES } from '~/locales'

const LOCALE_INJECTION_KEY = Symbol('locale') as InjectionKey<{
  locale: ShallowRef<Locale>
  localeKey: ShallowRef<LocaleKey>
  setLocale: (newLocale: LocaleKey) => void
}>

export function useLocalization() {
  return inject(LOCALE_INJECTION_KEY)!
}

export function useLocale() {
  const { locale } = useLocalization()
  return locale
}

export const localization: Plugin<{ defaultLocale: LocaleKey }> = (app, options) => {
  const localeKey = useLocalStorage<LocaleKey>('locale', options.defaultLocale)
  const locale = computed(() => LOCALES[localeKey.value])
  const setLocale = (newLocale: LocaleKey) => {
    localeKey.value = newLocale
  }

  app.provide(LOCALE_INJECTION_KEY, { locale, setLocale, localeKey })

  app.config.globalProperties.$t = new Proxy(locale, {
    get: (target, key) => {
      return target.value[key as keyof Locale]
    },
  }) as unknown as Locale
}
