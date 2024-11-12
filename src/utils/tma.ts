import type { TelegramWebApps } from 'telegram-webapps'
import '~/vendor/telegram-web-app'

const appGlobal = Telegram.WebApp

export function haptic(type: 'soft' | 'light' | 'error' | 'success') {
  tryTo((app) => {
    switch (type) {
      case 'light': return void app.HapticFeedback.impactOccurred('light')
      case 'soft': return void app.HapticFeedback.impactOccurred('soft')
      case 'error': return void app.HapticFeedback.notificationOccurred('error')
      case 'success': return void app.HapticFeedback.notificationOccurred('success')
    }
  })
}

export function tryTo(fn: (tma: TelegramWebApps.WebApp) => void) {
  try {
    fn(appGlobal)
  }
  catch (err) {
    console.error('Failed to execute function with Mini App.', err)
  }
}

let inited = false
export function init() {
  appGlobal.ready()
  appGlobal.expand()
  appGlobal.disableVerticalSwipes()
  tryTo(app => void app.BackButton.hide())
  tryTo(app => void app.MainButton.hide())
  tryTo(app => void app.SecondaryButton.hide())
  inited = true
}

if (!inited)
  init()
