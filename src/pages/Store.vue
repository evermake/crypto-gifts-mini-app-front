<script setup lang="ts">
</script>

<template>
  <div>
    <div :class="$style.header">
      <span :class="$style.icon" class="icon i-gifts" />
      <h1 :class="$style.title">
        {{ $t.pages.store.title }}
      </h1>
      <h3 :class="$style.subtitle">
        {{ $t.pages.store.subtitle }}
      </h3>
    </div>
    <div :class="$style.gifts">
      <img v-for="(_, i) in Array.from({ length: 7 }).fill(null)" :key="i" src="/Store.png">
    </div>
  </div>
</template>

<style lang="scss" module>
.header {
  margin-top: 24px;
  margin-bottom: 16px;
  text-align: center;
}

.icon {
  color: var(--primary);
  font-size: 48px;
}

.title {
  font-size: 1.5rem;
  font-weight: 590;
  line-height: 2rem;
  letter-spacing: -0.02688rem;
  margin-top: 16px;
}

.subtitle {
  @include t.body;
  color: var(--text-secondary);
  margin-top: 8px;
}

.gifts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;

  & > * {
    width: calc((100% - 12px) / 2);
  }
}
</style>
