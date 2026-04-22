export function formatNumber(value: number, digits = 2) {
  return value.toFixed(digits)
}

export function formatGap(value: number) {
  return value.toFixed(2)
}
