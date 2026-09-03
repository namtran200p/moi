export const ASSET_CATEGORIES = [
  'DCDS',
  'ETF',
  'Stock',
  'Crypto',
  'Bank',
] as const

export const STOCK_ACCOUNTS = [
  'VPS',
  'SSI',
] as const

export const CURRENCIES = [
  'VND',
  'USD',
] as const

export const TRANSACTION_TYPES = [
  'BUY',
  'SELL',
  'CASH_DIVIDEND',
  'STOCK_DIVIDEND',
  'DEPOSIT',
  'WITHDRAWAL',
  'BANK_DEPOSIT',
  'BANK_CLOSE',
] as const

export const T_PLUS_STATUSES = [
  'OPEN',
  'PARTIAL_COMPLETED',
  'COMPLETED',
] as const

export const STOCK_TPLUS_SELL_MULTIPLIER = 1.03

export const CRYPTO_TPLUS_SELL_MULTIPLIER = 1.05

export const DCDS_QUANTITY_DECIMALS = 4

export const roundTo4 = (value: number): number =>
  Math.round(value * 10000) / 10000