import type { Asset } from "@/types/asset"

export type AssetSummary = {
  quantity: number
  avgBuyPrice: number
  currentPrice: number
  totalCost: number
  currentValue: number
  totalProfitLoss: number
  plPercentage: number
}

export function getAssetSummary(asset: Asset): AssetSummary {
  let totalQuantity = 0
  let totalCost = 0
  let currentPrice = 0
  let latestDate = 0

  const sorted = [...(asset.transactions || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  sorted.forEach((transaction) => {
    if (transaction.type === "buy") {
      totalQuantity += transaction.quantity
      totalCost += transaction.quantity * transaction.pricePerUnit
      currentPrice = transaction.pricePerUnit
      latestDate = new Date(transaction.date).getTime()
    } else if (transaction.type === "sell") {
      if (totalQuantity > 0) {
        const proportionSold = transaction.quantity / totalQuantity
        totalCost -= totalCost * proportionSold
      }
      totalQuantity -= transaction.quantity
      currentPrice = transaction.pricePerUnit
      latestDate = new Date(transaction.date).getTime()
    } else if (transaction.type === "update") {
      currentPrice = transaction.pricePerUnit
      latestDate = new Date(transaction.date).getTime()
    }
  })

  const finalQuantity = Math.max(0, totalQuantity)
  const avgBuyPrice = finalQuantity > 0 ? totalCost / finalQuantity : 0
  const currentValue = finalQuantity * currentPrice
  const totalProfitLoss = currentValue - totalCost
  const plPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0

  return {
    quantity: finalQuantity,
    avgBuyPrice,
    currentPrice,
    totalCost,
    currentValue,
    totalProfitLoss,
    plPercentage,
  }
}

export function getPortfolioSummary(assets: Asset[]) {
  let totalValue = 0
  let totalCost = 0

  assets.forEach((asset) => {
    if (!asset.transactions) {
      return
    }

    const summary = getAssetSummary(asset)
    totalValue += summary.currentValue
    totalCost += summary.totalCost
  })

  const totalProfitLoss = totalValue - totalCost
  const plPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0

  return {
    totalValue,
    totalCost,
    totalProfitLoss,
    plPercentage,
  }
}
