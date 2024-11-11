import en from './_en'
import ru from './_ru'

export type Locale = typeof en
export type LocaleKey = keyof typeof LOCALES
export const LOCALES = { en, ru }
