import bezier from 'bezier-easing'
import { randint } from '~/utils/random'

onmessage = (event) => {
  const { type, ...payload } = event.data
  switch (type) {
    case 'init': {
      const { id, canvas, dpr, width, height } = payload as { id: number, canvas: OffscreenCanvas, dpr: number, width: number, height: number }
      startDrawing(id, canvas, dpr, width, height)
      break
    }
    case 'stop': {
      const { id } = payload as { id: number }
      stopDrawing(id)
      break
    }
  }
}

const activeDrawers = new Map<number, (t: number) => void>()
let rafHandle: number | null = null

function startDrawing(
  id: number,
  canvas: OffscreenCanvas,
  dpr: number,
  width: number,
  height: number,
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error(`Canvas has already been intialized (getContext returned null) for ID ${id}.`)
    return
  }
  ctx.scale(dpr, dpr)

  const drawer = createDrawer(ctx, width, height)
  activeDrawers.set(id, drawer)

  if (rafHandle == null) {
    rafHandle = requestAnimationFrame(drawAll)
  }
}

function stopDrawing(id: number) {
  activeDrawers.delete(id)
  if (activeDrawers.size === 0 && rafHandle != null) {
    cancelAnimationFrame(rafHandle)
    rafHandle = null
  }
}

function drawAll(t: number) {
  activeDrawers.forEach(drawer => drawer(t))
  rafHandle = requestAnimationFrame(drawAll)
}

const easingMove = bezier(0, 0, 0.65, 1)
const easingScale = bezier(1, 0, 1, 0.2)
const COLORS = ['#FECC13', '#FF9044', '#FEBF05']
const STAR_PATH = new Path2D(`M5 10C4.74006 10 4.5331 9.81233 4.48012 9.53309C3.98448 6.32814 3.58533 5.948 0.481275 5.5197C0.202037 5.48118 0 5.26945 0 4.99998C0 4.73047 0.206965 4.50913 0.486202 4.47542C3.59478 4.12895 4.03745 3.67658 4.48012 0.466785C4.52365 0.192471 4.73513 0 5 0C5.25994 0 5.47142 0.192471 5.51495 0.466785C6.00115 3.67658 6.4196 4.09043 9.51873 4.47542C9.79304 4.51394 10 4.73047 10 4.99998C10 5.26945 9.79304 5.48602 9.5138 5.5197C6.40522 5.87101 5.95762 6.32334 5.51495 9.53309C5.47635 9.80741 5.26487 10 5 10Z`)
const STAR_SIZE_HALF = 10 / 2 // Based on the star's path.
const STAR_SCALE_RANGE = [0.4, 1.2]
const SPAWN_RATE = 65 // Stars per second.

function createDrawer(ctx: OffscreenCanvasRenderingContext2D, W: number, H: number) {
  let stars: Star[] = []
  let lastSpawnedAt = -999999
  const drawer = (t: number) => {
    ctx.clearRect(0, 0, W, H)
    stars = stars.filter(star => drawStar(ctx, star, t, W, H))
    if (t - lastSpawnedAt > (1000 / SPAWN_RATE)) {
      stars.push(spawnStar(t))
      lastSpawnedAt = t
    }
  }
  return drawer
}

/** Renders a star using the context. Returns whether the star is alive. */
function drawStar(
  ctx: OffscreenCanvasRenderingContext2D,
  s: Star,
  t: number,
  canvasWidth: number,
  canvasHeight: number,
): boolean {
  if (t < s.spawnTime || t >= s.spawnTime + s.lifeTime)
    return false

  const dt = (t - s.spawnTime) / (s.lifeTime)

  const mMove = easingMove(dt)
  const x = s.x0 + mMove * (s.x1 - s.x0)
  const y = s.y0 + mMove * (s.y1 - s.y0)
  const scale = s.sizeM - (easingScale(dt) * s.sizeM)

  const m = new DOMMatrixReadOnly()
    .translate(x + canvasWidth / 2 - STAR_SIZE_HALF, y + canvasHeight / 2 - STAR_SIZE_HALF)
    .scale(scale, scale, 0, STAR_SIZE_HALF, STAR_SIZE_HALF, 0)

  ctx.fillStyle = COLORS[s.colorI]
  const p = new Path2D()
  p.addPath(STAR_PATH, m)
  ctx.fill(p)

  return true
}

function spawnStar(now: number): Star {
  const x0 = randint(51) - 25
  const y0 = randint(51) - 25
  const deg = Math.random() * 2 * Math.PI
  const dist = (60 + randint(85))
  const x1 = Math.cos(deg) * dist
  const y1 = Math.sin(deg) * dist
  const [xs, xl] = STAR_SCALE_RANGE

  return {
    colorI: randint(COLORS.length),
    spawnTime: now,
    lifeTime: 1750 + randint(500),
    x0,
    y0,
    x1,
    y1,
    sizeM: xs + (xl - xs) * Math.random(),
  }
}

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
