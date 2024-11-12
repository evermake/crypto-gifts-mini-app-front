import type { AppRouter } from 'api/router'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { loadInitData } from '~/utils/tma'

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_PUBLIC_API_BASE_URL}/trpc`,
      headers: {
        'tma-init-data': loadInitData() ?? undefined,
      },
    }),
  ],
})

export type SendableGift = Awaited<ReturnType<typeof client.mySendableGifts.query>>[number]
export type SentGift = Awaited<ReturnType<typeof client.userGifts.query>>[number]
export type GiftKind = Awaited<ReturnType<typeof client.giftKinds.query>>[number]
export type Price = GiftKind['price']
