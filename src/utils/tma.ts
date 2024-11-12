import type { TelegramWebApps } from 'telegram-webapps'
import { computed, ref, watch, watchEffect } from 'vue'
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

export interface BottomButtonState {
  text: string
  loading: boolean
  visible: boolean
  active: boolean
  shining: boolean
}

export const mainBtnState = ref<BottomButtonState>({
  text: '',
  loading: false,
  visible: false,
  active: true,
  shining: false,
})
export const secondaryBtnState = ref<BottomButtonState>({
  text: '',
  loading: false,
  visible: false,
  active: true,
  shining: false,
})

function updateState(btn: TelegramWebApps.BottomButton, { text, loading, visible, active, shining }: BottomButtonState) {
  btn.setParams({
    text,
    is_visible: visible,
    is_active: active,
    has_shine_effect: shining,
  })
  if (loading) {
    btn.showProgress()
  }
  else {
    btn.hideProgress()
  }
}
watch(mainBtnState, (newState) => {
  tryTo(app => void updateState(app.MainButton, newState))
}, { deep: true })
watch(secondaryBtnState, (newState) => {
  tryTo(app => void updateState(app.SecondaryButton, newState))
}, { deep: true })

const bottomBarVisible = computed(() => mainBtnState.value.visible || secondaryBtnState.value.visible)
watchEffect(() => {
  if (bottomBarVisible.value) {
    document.documentElement.classList.add('with-bottom-bar')
  }
  else {
    document.documentElement.classList.remove('with-bottom-bar')
  }
})

let initialized = false
export function init() {
  appGlobal.ready()
  appGlobal.expand()
  appGlobal.disableVerticalSwipes()
  tryTo(app => void app.BackButton.hide())
  tryTo(app => void app.MainButton.hide())
  tryTo(app => void app.SecondaryButton.hide())
  initialized = true
}

if (!initialized)
  init()
