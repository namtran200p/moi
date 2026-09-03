export type TPlusLotStatus =
  | 'OPEN'
  | 'PARTIAL_COMPLETED'
  | 'COMPLETED'

export interface TPlusLot {
  id: string

  workspaceId: string

  code: string

  category: 'Stock' | 'Crypto'

  account?: 'VPS' | 'SSI'

  buyTransactionId: string

  buyDate: string

  buyQuantity: number

  buyPrice: number

  openQuantity: number

  sellQuantity: number

  sellPrice?: number

  fees: number

  tax: number

  grossProfit: number

  netProfit: number

  status: TPlusLotStatus
}

export interface TPlusCycle {
  lotId: string

  code: string

  account?: 'VPS' | 'SSI'

  holdingBeforeTPlus: number

  buyQuantity: number

  buyPrice: number

  sellQuantity: number

  sellPrice?: number

  averageCostBefore: number

  averageCostAfter: number

  costReduction: number

  remainingHolding: number

  remainingUnrealizedPL: number

  netProfit: number

  status: TPlusLotStatus
}