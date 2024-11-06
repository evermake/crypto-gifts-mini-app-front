import type { Locale } from '.'
import { pluralize, spacedNumber } from '~/utils/text'

export default ((): Locale => ({
  tabbar: {
    tab: {
      store: 'Магазин',
      gifts: 'Подарки',
      leaderboard: 'Топ',
      profile: 'Профиль',
    },
  },
  pages: {
    profile: {
      giftsReceived: (n: number) => `${spacedNumber(n)} ${pluralize(n, 'подарок получен', 'подарка получено', 'подарков получено')}`,
    },

    store: {
      title: 'Покупай и дари подарки',
      subtitle: 'Уникальные подарки для всех от Crypto Bot.',
    },
  },
  giftInfo: {
    from: 'От',
    date: 'Дата',
    price: 'Цена',
    availability: 'Доступно',
  },
}))()
