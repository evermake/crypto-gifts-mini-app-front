<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  Telegram.WebApp.MainButton.setParams({
    color: '#000000',
    text_color: '#ffffff',
    has_shine_effect: true,
    is_active: true,
    is_visible: true,
    position: 'bottom',
    text: 'Close Me',
  });
  Telegram.WebApp.MainButton.onClick(() => {
    Telegram.WebApp.close();
  });
});
</script>

<template>
  <div>
    <h1>Hi!!!</h1>
  </div>
</template>
