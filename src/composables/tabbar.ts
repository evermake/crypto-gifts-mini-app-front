import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

const TABBAR_CONTEXT_INJECTION_KEY = Symbol('tabbar') as InjectionKey<{
  hide: () => void
  show: () => void
  visible: Ref<boolean>
}>

export function provideTabbarContext(defaultVisible: boolean = true) {
  const visible = ref(defaultVisible)
  provide(TABBAR_CONTEXT_INJECTION_KEY, {
    show: () => {
      visible.value = true
    },
    hide: () => {
      visible.value = false
    },
    visible,
  })
}

export function useTabbar() {
  return inject(TABBAR_CONTEXT_INJECTION_KEY)!
}
