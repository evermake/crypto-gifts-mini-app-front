export function haptic(type: 'soft' | 'light' | 'error' | 'success') {
  try {
    switch (type) {
      case 'light': return void Telegram.WebApp.HapticFeedback.impactOccurred('light')
      case 'soft': return void Telegram.WebApp.HapticFeedback.impactOccurred('soft')
      case 'error': return void Telegram.WebApp.HapticFeedback.notificationOccurred('error')
      case 'success': return void Telegram.WebApp.HapticFeedback.notificationOccurred('success')
    }
  }
  catch (err) {
    console.error('haptic error', err)
  }
}
