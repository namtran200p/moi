export type DisplayCurrency = 'VND' | 'USD'

export function formatNumber(
  value: number,
  maximumFractionDigits = 2,
): string {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits,
  }).format(value)
}

export function formatVND(value: number): string {
  return `${formatNumber(value, 0)} VNĐ`
}

export function formatUSD(value: number): string {
  return `$${formatNumber(value, 2)}`
}

export function formatCompactVND(value: number): string {
  const abs = Math.abs(value)

  if (abs >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000, 1)} Tỷ VNĐ`
  }

  if (abs >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, 1)} Tr VNĐ`
  }

  if (abs >= 1_000) {
    return `${formatNumber(value / 1_000, 1)}K VNĐ`
  }

  return formatVND(value)
}

export function formatStockPrice(price: number): string {
  return formatNumber(price, 2)
}

export function convertVndToUsd(
  vnd: number,
  exchangeRate: number,
): number {
  if (exchangeRate <= 0) return 0
  return vnd / exchangeRate
}

export function convertUsdToVnd(
  usd: number,
  exchangeRate: number,
): number {
  return usd * exchangeRate
}