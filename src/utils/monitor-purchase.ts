import type { SendableGift } from '~/api'
import { client } from '~/api'

// FIXME: Use websockets or something better.
let targetGiftId: string | null = null
export async function waitForPurchase(giftId: string): Promise<SendableGift> {
  if (targetGiftId === giftId)
    throw new Error('Already waiting for this gift.')

  targetGiftId = giftId
  try {
    while (true) {
      // Give up on the first failed request.
      const result = await client.myGiftStatus.query({ giftId })

      switch (result.status) {
        case 'pending':
          break
        case 'purchased':
          return result.gift
        case 'sent':
          throw new Error(`Gift (${giftId}) has already been sent.`)
      }

      await new Promise(res => setTimeout(res, 1500))

      if (targetGiftId !== giftId) {
        throw new Error(`targetGiftId changed (${giftId} => ${targetGiftId})`)
      }
    }
  }
  finally {
    targetGiftId = null
  }
}
