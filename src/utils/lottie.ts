import { getCpuCount } from './browser'

let workerCounter = 1
const concurrency = Math.min(getCpuCount() - 1, 4)
export function getLottieWorkerId() {
  return `worker-${(workerCounter++) % concurrency}`
}
