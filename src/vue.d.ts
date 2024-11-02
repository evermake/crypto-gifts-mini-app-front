import type { Locale } from './locales'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: Locale
  }
}
