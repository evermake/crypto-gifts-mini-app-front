import { spacedNumber } from '~/utils/text'

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
      giftsReceived: (n: number) => `${spacedNumber(n)} gifts received`,
    },

    store: {
      title: 'Buy and Send Gifts',
      subtitle: 'Unique gifts for everyone by Crypto Pay.',
    },
  },
  giftInfo: {
    from: 'From',
    date: 'Date',
    price: 'Price',
    availability: 'Availability',
  },
}
