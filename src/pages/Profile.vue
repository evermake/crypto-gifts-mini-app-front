<script setup lang="ts">
import Avatar from '~/components/Avatar.vue'
</script>

<template>
  <div>
    <div :class="$style.profile">
      <Avatar :top="160" />
      <div :class="$style.titles">
        <h1 :class="$style.title">
          Alicia
        </h1>
        <h3 :class="$style.subtitle">
          1 000 gifts received
        </h3>
      </div>
    </div>
    <div :class="$style.gifts" />
  </div>
</template>

<style module lang="scss">
.profile {
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
  gap: 12px;
}

.gifts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 24px 16px 16px;
}

.titles {
  text-align: center;
}

.title {
  @include t.title-1;
}

.subtitle {
  @include t.body;
  color: var(--text-secondary);
}
</style>
