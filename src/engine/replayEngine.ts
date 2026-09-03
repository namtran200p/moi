import type { Transaction } from '../types/transaction'
import type { Holding } from '../types/portfolio'

export interface ReplayResult {
  holdings: Holding[]
  originalCapital: number
  realizedPnL: number
  dividends: number
}

function transactionTime(transaction: Transaction): number {
  const date = new Date(transaction.transactionDate).getTime()

  if (!Number.isNaN(date)) {
    return date
  }

  return new Date(transaction.createdAt).getTime()
}

export function sortTransactions(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort(
    (a, b) => transactionTime(a) - transactionTime(b),
  )
}

/**
 * Initial skeleton of the deterministic replay engine.
 *
 * Important:
 * - No mock data
 * - No hard-coded holdings
 * - Deleted records must already be filtered by repository/query layer
 * - Every historical transaction is replayed chronologically
 */
export function replayPortfolio(
  transactions: Transaction[],
): ReplayResult {
  const sorted = sortTransactions(transactions)

  const holdingMap = new Map<string, Holding>()

  let originalCapital = 0
  let realizedPnL = 0
  let dividends = 0

  for (const transaction of sorted) {
    switch (transaction.transactionType) {
      case 'DEPOSIT': {
        originalCapital += transaction.amountVnd ?? 0
        break
      }

      case 'WITHDRAWAL': {
        originalCapital -= transaction.amountVnd ?? 0
        break
      }

      case 'CASH_DIVIDEND': {
        dividends += transaction.amountVnd ?? 0
        break
      }

      case 'BUY': {
        if (!transaction.code || !transaction.quantity) {
          break
        }

        const key = [
          transaction.category,
          transaction.account ?? '',
          transaction.code,
        ].join(':')
        
        const existing = holdingMap.get(key)

        const quantity = transaction.quantity
        const price = transaction.price ?? transaction.priceUsd ?? 0

        if (!existing) {
          holdingMap.set(key, {
            assetId: key,
            category: transaction.category!,
            code: transaction.code,
            account: transaction.account,

            quantity,
            averageCost: price,
            marketPrice: price,
            marketValue: quantity * price,

            realizedPnL: 0,
            unrealizedPnL: 0,

            originalQuantity: transaction.isTradeTPlus
              ? 0
              : quantity,

            originalCost: transaction.isTradeTPlus
              ? 0
              : quantity * price,

            tPlusQuantity: transaction.isTradeTPlus
              ? quantity
              : 0,

            tPlusProfit: 0,
            costReduction: 0,
            adjustedCost: price,
          })
        } else {
          existing.quantity += quantity

          if (transaction.isTradeTPlus) {
            existing.tPlusQuantity += quantity
          } else {
            const oldCost =
              existing.originalQuantity *
              existing.averageCost

            existing.originalQuantity += quantity

            existing.originalCost =
              oldCost + quantity * price

            if (existing.originalQuantity > 0) {
              existing.averageCost =
                existing.originalCost /
                existing.originalQuantity
            }

            existing.adjustedCost =
              existing.averageCost
          }

          existing.marketValue =
            existing.quantity * existing.marketPrice
        }

        break
      }

      case 'SELL': {
        if (!transaction.code || !transaction.quantity) {
          break
        }

        const key = [
          transaction.category,
          transaction.account ?? '',
          transaction.code,
        ].join(':')

        const existing = holdingMap.get(key)

        if (!existing) {
          break
        }

        const quantity = transaction.quantity
        const sellPrice =
          transaction.price ??
          transaction.priceUsd ??
          0

        const cost =
          existing.averageCost * quantity

        const revenue =
          sellPrice * quantity

        const fee =
          revenue *
          ((transaction.feeRate ?? 0) / 100)

        const tax =
          revenue *
          ((transaction.taxRate ?? 0) / 100)

        const pnl =
          revenue - cost - fee - tax

        realizedPnL += pnl

        existing.quantity =
          Math.max(0, existing.quantity - quantity)

        existing.marketValue =
          existing.quantity * existing.marketPrice

        existing.realizedPnL += pnl

        break
      }

      case 'STOCK_DIVIDEND': {
        if (!transaction.code || !transaction.quantity) {
          break
        }

        const key = [
          transaction.category,
          transaction.account ?? '',
          transaction.code,
        ].join(':')

        const existing = holdingMap.get(key)

        if (existing) {
          existing.quantity += transaction.quantity
        }

        break
      }

      case 'BANK_DEPOSIT':
      case 'BANK_CLOSE':
        // Bank calculation will be handled by bankEngine.
        break

      default:
        break
    }
  }

  const holdings = [...holdingMap.values()]

  return {
    holdings,
    originalCapital,
    realizedPnL,
    dividends,
  }
}