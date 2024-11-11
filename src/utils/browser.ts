export function getCpuCount() {
  try {
    return Math.max(1, navigator.hardwareConcurrency)
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (_) {
    return 2
  }
}
