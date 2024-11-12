<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { client } from '~/api'
import RouteRoot from '~/components/RouteRoot.vue'
import UserPic from '~/components/UserPic.vue'

const router = useRouter()
const { data: leaders } = useQuery({
  queryKey: ['top'],
  queryFn: async () => {
    return await client.leaderboard.query({})
  },
})

function handleUserClick(id: string) {
  router.push({ name: 'user', params: { userId: id } })
}
</script>

<template>
  <RouteRoot
    :should-fade="(to) => to.name === 'user'"
  >
    <div v-if="leaders" :class="$style.rows">
      <div
        v-for="user in leaders"
        :key="user.id"
        :class="$style.row"
        @click="handleUserClick(user.id)"
      >
        <div :class="$style.leading">
          <UserPic :class="$style.pic" :user-id="user.id" :name="user.name" />
        </div>
        <div :class="$style.rowBody">
          <div :class="$style.text">
            <h4 :class="$style.name">
              {{ user.name }}
            </h4>
            <div :class="$style.gifts">
              <span class="icon i-gifts" :class="$style.giftIcon" />
              <span>{{ $t.pages.leaderboard.gifts(user.receivedGiftsCount) }}</span>
            </div>
          </div>
          <span :class="$style.rank">{{ `#${user.rank}` }}</span>
        </div>
      </div>
    </div>
  </RouteRoot>
</template>

<style lang="scss" module>
.rows {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-family: var(--font-sf-pro-text);
}

.row {
  height: 56px;
  display: flex;
  align-items: center;
  padding-right: 10px;
}

.leading {
  padding-left: 16px;
  margin-right: 12px;
}

.pic {
  height: 40px;
}

.rowBody {
  flex-grow: 1;
  display: flex;
  align-items: center;
  position: relative;
  padding: 8px 0;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--separator);

    @media (min-resolution: 2x) {
      height: 0.33px;
    }
  }

  &::after {
    bottom: 0;
  }
}

.text {
  flex-grow: 1;
}

.name {
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.375rem;
  letter-spacing: -0.02763rem;
}

.gifts {
  color: var(--primary);
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;

  & > span:nth-child(2) {
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1rem;
    letter-spacing: -0.00625rem;
  }
}

.rank {
  color: var(--text-secondary);
  font-family: var(--font-sf-pro);
  font-size: 0.9375rem;
  font-weight: 510;
  line-height: 1.375rem;
  letter-spacing: -0.02688rem;
}
</style>
