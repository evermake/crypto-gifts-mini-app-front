import { createApp } from 'vue'

import App from './App.vue'
import en from './locales/en'
import { localization } from './plugins/localization'
import '~/assets/css/main.scss'

createApp(App)
  .use(localization, { defaultLocale: en })
  .mount('#app')
