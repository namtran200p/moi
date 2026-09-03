export type AssetCategory =
  | 'DCDS'
  | 'ETF'
  | 'Stock'
  | 'Crypto'
  | 'Bank'

export type StockAccount = 'VPS' | 'SSI'

export type Currency = 'VND' | 'USD'

export interface PortfolioAsset {
  id: string
  workspaceId: string
  category: AssetCategory
  code: string
  account?: StockAccount
  name?: string
}

export interface Holding {
  assetId: string
  category: AssetCategory
  code: string
  account?: StockAccount

  quantity: number

  averageCost: number
  marketPrice: number
  marketValue: number

  realizedPnL: number
  unrealizedPnL: number

  originalQuantity: number
  originalCost: number

  tPlusQuantity: number
  tPlusProfit: number
  costReduction: number
  adjustedCost: number
}