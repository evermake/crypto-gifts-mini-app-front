<script setup lang="ts">
import type { Tab } from './types'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { client } from './api'
import TabBar from './components/TabBar.vue'
import { useLocale } from './utils/localization'
import { RECEIVED_GIFT_STORAGE_KEY, REDEEMED_GIFT_ID_STORAGE_KEY } from './utils/misc'
import { appGlobal, showError } from './utils/tma'

function parseReceiveToken(s: string): string | null {
  const match = /^rt__([\w-]{8,})$/i.exec(s)
  return match ? match[1] : null
}

const t = useLocale()
const router = useRouter()
const queryClient = useQueryClient()
const pendingReceiveToken = ref(parseReceiveToken(appGlobal.initDataUnsafe?.start_param ?? ''))
const { mutate: receiveGift, isPending: receiving } = useMutation({
  mutationFn: async (token: string) => {
    return await client.receiveGift.mutate({ receiveToken: token })
  },
  onError: (error) => {
    showError({
      title: t.value.popups.failedReceiveGift,
      message: error.message,
    })
  },
  onSuccess: (receivedGift) => {
    if (sessionStorage.getItem(REDEEMED_GIFT_ID_STORAGE_KEY) !== receivedGift.id) {
      localStorage.setItem(RECEIVED_GIFT_STORAGE_KEY, JSON.stringify(receivedGift))
      router.push({ name: 'gift-received' })
    }
  },
  onSettled: () => {
    pendingReceiveToken.value = null
    queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    queryClient.invalidateQueries({ queryKey: ['user-gifts', 'me'] })
  },
})

watchEffect(() => {
  if (pendingReceiveToken.value && !receiving.value) {
    receiveGift(pendingReceiveToken.value)
  }
})

const tab = computed({
  get: () => {
    switch (router.currentRoute.value.name) {
      case 'me': return 'profile'
      case 'leaderboard': return 'leaderboard'
      case 'store': return 'store'
      case 'gifts': return 'gifts'
    }
    return null
  },
  set: (newTab: Tab) => {
    switch (newTab) {
      case 'store': return void router.replace('/store')
      case 'gifts': return void router.replace('/gifts')
      case 'leaderboard': return void router.replace('/leaderboard')
      case 'profile': return void router.replace('/profile')
    }
  },
})
</script>

<template>
  <div :class="$style.root">
    <div :class="$style.page">
      <RouterView v-slot="{ Component, route }">
        <Transition
          :mode="route.meta.willFade ? 'default' : 'out-in'"
          :name="route.meta.willFade ? 'page-fade' : undefined"
        >
          <KeepAlive>
            <component :is="Component" />
          </KeepAlive>
        </Transition>
      </RouterView>
    </div>
    <TabBar v-model:tab="tab" :class="$style.tabbar" />
  </div>
</template>

<style module lang="scss">
.root {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: auto;
}
.page {
  flex: 1 0 auto;
}
</style>

<style>
.page-fade-enter-from,
.page-fade-leave-to {
  filter: blur(12px);
  opacity: 0;
  transform: scale(0.8);
}
.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 300ms ease,
    filter 300ms ease,
    transform 300ms ease;
}
.page-fade-enter-to,
.page-fade-leave-from {
  filter: blur(0);
  opacity: 1;
  transform: scale(1);
}
</style>
