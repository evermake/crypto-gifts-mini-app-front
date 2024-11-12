import type { Price } from '~/api'

export function spacedNumber(n: number): string {
  // https://stackoverflow.com/a/16637170
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function shortenNumber(n: number): string {
  if (n < 1_000_000 && n % 1_000 === 0)
    return `${n / 1_000}K`
  if (n % 1_000_000 === 0)
    return `${n / 1_000_000}M`
  return spacedNumber(n)
}

export function pluralizeRu(n: number, one: string, few: string, many: string) {
  if (n % 10 === 1 && n % 100 !== 11)
    return one
  else if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20))
    return few
  else
    return many
}

export function pluralizeEn(n: number, one: string, other: string) {
  return n === 1 ? one : other
}

export function priceToText(price: Price): string {
  return `${price.amount.replace(/\.?0+$/, '')} ${price.asset}`
}

export function dateCalendarDateShort(d: Date) {
  const mm = (d.getMonth() + 1).toString().padStart(2, '0')
  const dd = (d.getDate()).toString().padStart(2, '0')
  const yy = d.getFullYear() % 2000
  return `${dd}.${mm}.${yy}`
}

export function clockTime(d: Date) {
  const HH = (d.getHours()).toString().padStart(2, '0')
  const MM = (d.getMinutes()).toString().padStart(2, '0')
  return `${HH}:${MM}`
}
