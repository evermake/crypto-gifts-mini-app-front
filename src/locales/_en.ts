import { clockTime, dateCalendarDateShort, pluralizeEn, spacedNumber } from '~/utils/text'

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
      noGifts: 'You can buy a gift to receive a gift in return.',
      openStore: 'Open Store',
    },

    leaderboard: {
      gifts: (n: number) => `${n} ${pluralizeEn(n, 'gift', 'gifts')}`,
    },

    gifts: {
      title: 'Send Gifts in Telegram',
      subtitle: 'Send gifts to users that can be stored in their app profile.',
      noGifts: 'You don\'t have any gifts yet.',
      openStore: 'Open Store',
      send: 'Send',
      sendGift: 'Send Gift',
    },

    store: {
      title: 'Buy and Send Gifts',
      subtitle: 'Unique gifts for everyone by Crypto Pay.',
      giftInfoText: 'Purchase this gift for the opportunity to give it to another user.',
    },

    giftPurchased: {
      title: 'Gift Purchased',
      youBoughtGift: 'You Bought a Gift',
      nowSend: 'Now send it to your friend.',
    },
    giftReceived: {
      title: 'Gift Received',
      giftFrom: (gift: string, sender: string) => `${gift} from ${sender}.`,
    },
  },
  table: {
    gift: 'Gift',
    date: 'Date',
    price: 'Price',
    availability: 'Availability',
    from: 'From',
  },
  bottomButtons: {
    close: 'Close',
    buyGift: 'Buy a Gift',
    sendGift: 'Send Gift',
    sendGiftToContact: 'Send Gift to Contact',
    openStore: 'Open Store',
    openProfile: 'Open Profile',
  },
  popups: {
    failedPurchaseGift: 'Failed to purchase a gift',
    failedReceiveGift: 'Failed to receive a gift',
  },
  misc: {
    date: (d: Date) => `${dateCalendarDateShort(d)} at ${clockTime(d)}`,
    of: 'of',
  },
}
