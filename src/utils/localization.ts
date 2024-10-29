import type { InjectionKey, Plugin, ShallowRef } from 'vue'
import { inject, shallowRef } from 'vue'
import type { Locale } from '~/locales'

const LOCALE_INJECTION_KEY = Symbol('locale') as InjectionKey<{
  locale: ShallowRef<Locale>
  setLocale: (newLocale: Locale) => void
}>

export function useLocalization() {
  return inject(LOCALE_INJECTION_KEY)!
}

export function useLocale() {
  const { locale } = useLocalization()
  return locale
}

export const localization: Plugin<{ defaultLocale: Locale }> = (app, options) => {
  const locale = shallowRef(options.defaultLocale)
  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
  }

  app.provide(LOCALE_INJECTION_KEY, { locale, setLocale })

  app.config.globalProperties.$t = new Proxy(locale, {
    get: (target, key) => {
      return target.value[key as keyof Locale]
    },
  }) as unknown as Locale
}
