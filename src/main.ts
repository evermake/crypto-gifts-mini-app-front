import { VueQueryPlugin } from '@tanstack/vue-query'
import { createApp } from 'vue'
import App from '~/App.vue'
import { appearance } from '~/utils/appearance'
import { localization } from '~/utils/localization'
import { router } from './router'
import './utils/tma'
import '~/assets/css/main.scss'

createApp(App)
  .use(localization, { defaultLocale: 'en' })
  .use(appearance)
  .use(VueQueryPlugin)
  .use(router)
  .mount('#app')
