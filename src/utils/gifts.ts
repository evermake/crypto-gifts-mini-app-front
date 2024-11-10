export const GIFT_NAME_FILENAME_MAP: { [key in string]?: string } = {
  'Delicious Cake': 'gift-delicious-cake',
  'Red Star': 'gift-red-star',
  'Green Star': 'gift-green-star',
  'Blue Star': 'gift-blue-star',
}

export function giftSvgUrl(giftName: string) {
  const filename = GIFT_NAME_FILENAME_MAP[giftName]
  if (filename)
    return `/gifts/${filename}.svg`
  return null
}

export function giftLottieUrl(giftName: string) {
  const filename = GIFT_NAME_FILENAME_MAP[giftName]
  if (filename)
    return `/gifts/${filename}.json`
  return null
}
