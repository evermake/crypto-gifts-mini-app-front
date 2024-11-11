import { getCpuCount } from './browser'

let workerCounter = 1
const cpuCount = Math.min(getCpuCount(), 4)
export function getLottieWorkerId() {
  return `worker-${(workerCounter++) % cpuCount}`
}
