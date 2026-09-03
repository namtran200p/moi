export type TransactionType =
  | 'BUY'
  | 'SELL'
  | 'CASH_DIVIDEND'
  | 'STOCK_DIVIDEND'
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'BANK_DEPOSIT'
  | 'BANK_CLOSE'

export type AssetCategory =
  | 'DCDS'
  | 'ETF'
  | 'Stock'
  | 'Crypto'
  | 'Bank'

export type StockAccount = 'VPS' | 'SSI'

export interface Transaction {
  id: string
  workspaceId: string

  transactionType: TransactionType
  transactionDate: string

  category?: AssetCategory
  code?: string
  account?: StockAccount

  quantity?: number

  /**
   * Stock / ETF / DCDS price.
   * Stock price uses thousand-VND display convention.
   */
  price?: number

  /**
   * Crypto trading price in USD.
   */
  priceUsd?: number

  /**
   * Historical locked USD/VND exchange rate.
   */
  lockedVndRate?: number

  /**
   * Deposit / withdrawal currency.
   */
  currency?: 'VND' | 'USD'

  /**
   * VND-normalized transaction value.
   */
  amountVnd?: number

  /**
   * Original currency amount.
   */
  originalAmount?: number

  /**
   * Snapshot fee/tax rates.
   */
  feeRate?: number
  taxRate?: number

  /**
   * Optional T+ lot relationship.
   */
  tPlusLotId?: string

  isTradeTPlus?: boolean

  note?: string

  createdAt: string
}