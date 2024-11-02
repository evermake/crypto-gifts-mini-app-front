<script setup lang="ts">
import bezier from 'bezier-easing'
import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import { randint } from '~/utils/random'

const canvasEl = shallowRef<HTMLCanvasElement | null>(null)

const COLORS = [
  '#FECC13',
  '#FF9044',
  '#FEBF05',
]
const starP = new Path2D(`M5 10C4.74006 10 4.5331 9.81233 4.48012 9.53309C3.98448 6.32814 3.58533 5.948 0.481275 5.5197C0.202037 5.48118 0 5.26945 0 4.99998C0 4.73047 0.206965 4.50913 0.486202 4.47542C3.59478 4.12895 4.03745 3.67658 4.48012 0.466785C4.52365 0.192471 4.73513 0 5 0C5.25994 0 5.47142 0.192471 5.51495 0.466785C6.00115 3.67658 6.4196 4.09043 9.51873 4.47542C9.79304 4.51394 10 4.73047 10 4.99998C10 5.26945 9.79304 5.48602 9.5138 5.5197C6.40522 5.87101 5.95762 6.32334 5.51495 9.53309C5.47635 9.80741 5.26487 10 5 10Z`)

const XS = 0.4
const XL = 1
const MAX_STARS = 80

interface Star {
  colorI: number
  sizeM: number
  spawnTime: number
  lifeTime: number
  x0: number
  y0: number
  x1: number
  y1: number
}

let rafHandle: number | null = null
onUnmounted(() => {
  if (rafHandle !== null)
    cancelAnimationFrame(rafHandle)
})

onMounted(() => {
  const ctx = canvasEl.value!.getContext('2d')!
  const W = canvasEl.value!.width
  const H = canvasEl.value!.height

  if (window.devicePixelRatio > 1) {
    canvasEl.value!.width = W * window.devicePixelRatio
    canvasEl.value!.height = H * window.devicePixelRatio
    canvasEl.value!.style.width = `${W}px`
    canvasEl.value!.style.height = `${H}px`

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  }

  const easingMove = bezier(0, 0, 0.65, 1)
  const easingScale = bezier(1, 0, 1, 0.2)

  /** Renders a star using the context. Returns whether the star is alive. */
  function drawStar(
    ctx: CanvasRenderingContext2D,
    s: Star,
    t: number,
  ): boolean {
    if (t < s.spawnTime || t >= s.spawnTime + s.lifeTime)
      return false

    const dt = (t - s.spawnTime) / (s.lifeTime)

    const mMove = easingMove(dt)
    const x = s.x0 + mMove * (s.x1 - s.x0)
    const y = s.y0 + mMove * (s.y1 - s.y0)
    const scale = s.sizeM - (easingScale(dt) * s.sizeM)

    const m = new DOMMatrixReadOnly()
      .translate(W / 2 - 5 + x, H / 2 - 5 + y)
      .scale(scale, scale, 0, 5, 5, 0)

    ctx.fillStyle = COLORS[s.colorI]
    const p = new Path2D()
    p.addPath(starP, m)
    ctx.fill(p)

    return true
  }

  function spawnStar(now: number): Star {
    const x0 = randint(51) - 25
    const y0 = randint(51) - 25
    const deg = Math.random() * 2 * Math.PI
    const dist = (60 + randint(100))
    const x1 = Math.cos(deg) * dist
    const y1 = Math.sin(deg) * dist

    return {
      colorI: randint(COLORS.length),
      spawnTime: now,
      lifeTime: 2500 + randint(2000),
      x0,
      y0,
      x1,
      y1,
      sizeM: XS + (XL - XS) * Math.random(),
    }
  }

  let stars: Star[] = []
  const draw = (t: number) => {
    ctx.clearRect(0, 0, W, H)

    stars = stars.filter(star => drawStar(ctx, star, t))
    if (stars.length < MAX_STARS)
      stars.push(spawnStar(t))

    rafHandle = requestAnimationFrame(draw)
  }
  rafHandle = requestAnimationFrame(draw)
})
const canvasSize = ref(300)
</script>

<template>
  <div :class="$style.root">
    <canvas ref="canvasEl" :width="canvasSize" :height="canvasSize" />
  </div>
</template>

<style module lang="scss">
.root {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
}
</style>
