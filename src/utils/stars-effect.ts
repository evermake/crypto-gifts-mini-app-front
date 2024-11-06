import StarsWorker from './stars-effect.worker?worker'

let worker: Worker | null = null
let canvasIdCounter = 1

export function useStarsEffect() {
  if (!worker) {
    worker = new StarsWorker()
    worker.onerror = (ev) => {
      console.error('Error in stars worker:', ev.error)
    }
  }

  const init = (canvas: HTMLCanvasElement, width: number, height: number) => {
    if (typeof canvas.transferControlToOffscreen !== 'function') {
      console.warn('Browser doesn\'t support offscreen canvas.')
      return -1
    }

    const dpr = window.devicePixelRatio

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const offscreen = canvas.transferControlToOffscreen()
    const id = canvasIdCounter++

    worker!.postMessage({
      type: 'init',
      id,
      canvas: offscreen,
      dpr,
      width,
      height,
    }, [offscreen])

    return id
  }
  const stop = (id: number) => {
    worker!.postMessage({ type: 'stop', id })
  }

  return { init, stop }
}
