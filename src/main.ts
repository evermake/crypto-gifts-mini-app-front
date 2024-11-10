import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from '~/App.vue'
import { en } from '~/locales'
import { appearance } from '~/utils/appearance'
import { localization } from '~/utils/localization'
import '~/assets/css/main.scss'

createApp(App)
  .use(localization, { defaultLocale: en })
  .use(appearance)
  .use(VueQueryPlugin)
  .mount('#app')
