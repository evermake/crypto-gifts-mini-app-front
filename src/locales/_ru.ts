import type { Locale } from '.'
import { clockTime, dateCalendarDateShort, pluralizeRu, spacedNumber } from '~/utils/text'

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
      openStore: 'Открыть магазин',
      noGifts: 'Вы можете купить подарок, чтобы получить подарок в ответ.',
    },

    gifts: {
      title: 'Отправляйте подарки в Telegram',
      subtitle: 'Отправляйте подарки пользователям, чтобы они отобразились в их профиле.',
      noGifts: 'У вас ещё нет подарков.',
      openStore: 'Открыть магазин',
      send: 'Отправить',
    },

    store: {
      title: 'Покупайте и дарите подарки',
      subtitle: 'Уникальные подарки для всех от Crypto Bot.',
      giftInfoText: 'Купите этот подарок, чтобы подарить его другому пользователю.',
    },
  },
  table: {
    gift: 'Подарок',
    date: 'Дата',
    price: 'Цена',
    availability: 'Наличие',
    from: 'От',
  },
  misc: {
    date: (d: Date) => `${dateCalendarDateShort(d)} at ${clockTime(d)}`,
    of: 'из',
  },
  bottomButtons: {
    buyGift: 'Купить подарок',
    sendGiftToContact: 'Отправить подарок',
  },
  popups: {
    failedPurchaseGift: 'Не удалось купить подарок',
  },
}))()
