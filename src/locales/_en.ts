import { pluralizeEn, spacedNumber } from '~/utils/text'

export default {
  tabbar: {
    tab: {
      store: 'Store',
      gifts: 'Gifts',
      leaderboard: 'Leaderboard',
      profile: 'Profile',
    },
  },
  pages: {
    profile: {
      giftsReceived: (n: number) => `${spacedNumber(n)} ${pluralizeEn(n, 'gift', 'gifts')} received`,
    },

    gifts: {
      title: 'Send Gifts in Telegram',
      subtitle: 'Send gifts to users that can be stored in their app profile.',
      noGifts: 'You don\'t have any gifts yet.',
      openStore: 'Open Store',
      send: 'Send',
    },

    store: {
      title: 'Buy and Send Gifts',
      subtitle: 'Unique gifts for everyone by Crypto Pay.',
      giftInfoText: 'Purchase this gift for the opportunity to give it to another user.',
    },
  },
  giftInfo: {
    from: 'From',
    date: 'Date',
    price: 'Price',
    availability: 'Availability',
  },
  misc: {
    of: 'of',
  },
}
