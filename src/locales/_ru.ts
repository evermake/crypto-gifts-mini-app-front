import type { Locale } from '.'
import { pluralizeRu, spacedNumber } from '~/utils/text'

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
      giftsReceived: (n: number) => `${spacedNumber(n)} ${pluralizeRu(n, 'подарок получен', 'подарка получено', 'подарков получено')}`,
    },

    gifts: {
      title: 'Отправляйте подарки в Telegram',
      subtitle: 'Отправляйте подарки пользователям, чтобы они отобразились в их профиле.',
      noGifts: 'У вас ещё нет подарков.',
      openStore: 'Открыть магазин',
    },

    store: {
      title: 'Покупайте и дарите подарки',
      subtitle: 'Уникальные подарки для всех от Crypto Bot.',
    },
  },
  giftInfo: {
    from: 'От',
    date: 'Дата',
    price: 'Цена',
    availability: 'Доступно',
  },
  misc: {
    of: 'из',
  },
}))()
