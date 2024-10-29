import { createApp } from 'vue'

import App from '~/App.vue'
import en from '~/locales/en'
import { localization } from '~/utils/localization'
import { appearance } from '~/utils/theme'
import '~/assets/css/main.scss'

createApp(App)
  .use(localization, { defaultLocale: en })
  .use(appearance)
  .mount('#app')
