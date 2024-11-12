import type { MaybeRef, Ref, ShallowRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useLocalStorage } from '@vueuse/core'
import { computed, unref, watchEffect } from 'vue'
import { client, type GiftKind } from '~/api'
import type { Locale } from '~/locales'
import { shortenNumber } from '~/utils/text'

export type GiftKindInternal = GiftKind & {
  color: 'gold' | 'red' | 'green' | 'blue'
  stickerId: string | null
}

export const GIFT_NAME_FILENAME_MAP: { [key in string]?: string } = {
  'Delicious Cake': 'gift-delicious-cake',
  'Red Star': 'gift-red-star',
  'Green Star': 'gift-green-star',
  'Blue Star': 'gift-blue-star',
}

export function useGiftKinds() {
  const cached = useLocalStorage<GiftKind[]>('gifts-kinds-cached', [])
  const { data: loaded, isFetching } = useQuery({
    queryKey: ['gift-kinds'],
    queryFn: async () => {
      return await client.giftKinds.query()
    },
  })

  watchEffect(() => {
    if (loaded.value) {
      cached.value = loaded.value
    }
  })

  const kinds = computed<GiftKindInternal[]>(() => (loaded.value || cached.value).map(kind => ({
    ...kind,
    color: colorByKindName(kind.name),
    stickerId: GIFT_NAME_FILENAME_MAP[kind.name] ?? null,
  })))

  const kindsByIds = computed<Map<string, GiftKindInternal>>(() => new Map(
    kinds.value.map(kind => [kind.id, kind]),
  ))

  return {
    loading: isFetching,
    kinds,
    kindsByIds,
  }
}

export function useGiftKind(
  kindId: MaybeRef<string>,
): { loading: Ref<boolean>, kind: ShallowRef<GiftKindInternal | null> } {
  const { loading, kindsByIds } = useGiftKinds()

  return {
    loading,
    kind: computed(() => kindsByIds.value.get(unref(kindId)) ?? null),
  }
}

const FALLBACK_KIND: GiftKindInternal = {
  id: 'fallback',
  inStock: 0,
  limit: 0,
  name: '—',
  color: 'gold',
  stickerId: 'fallback',
  price: {
    amount: '0.0',
    asset: 'TON',
  },
}

export function useMyGifts() {
  const { loading, kindsByIds } = useGiftKinds()

  // TODO: Pagination.
  const { data: myGifts, isFetching } = useQuery({
    queryKey: ['my-gifts'],
    queryFn: async () => {
      return await client.userGifts.query({ my: true })
    },
  })

  return {
    loading: computed(() => loading.value || isFetching.value),
    myGifts: computed(() => (
      (myGifts.value && kindsByIds.value.size > 0))
      ? myGifts.value.map(gift => ({ ...gift, kind: kindsByIds.value.get(gift.kindId) ?? FALLBACK_KIND }))
      : null,
    ),
  }
}

export type WithKind<T> = T & { kind: GiftKindInternal }
export function useExtendWithKind() {
  const { kindsByIds } = useGiftKinds()

  return computed(() => {
    const map = kindsByIds.value
    return <T extends { kindId: string }>(obj: T): WithKind<T> => {
      return ({
        ...obj,
        kind: map.get(obj.kindId) ?? FALLBACK_KIND,
      })
    }
  })
}

function colorByKindName(name: string) {
  name = name.toLowerCase()
  switch (true) {
    case name.includes('red'): return 'red'
    case name.includes('green'): return 'green'
    case name.includes('blue'): return 'blue'
  }
  return 'gold'
}

export function availabilityText(
  kind: GiftKindInternal,
  locale: Locale,
  alwaysOne = false,
) {
  return `${alwaysOne ? 1 : shortenNumber(kind.limit - kind.inStock)} ${locale.misc.of} ${shortenNumber(kind.limit)}`
}
