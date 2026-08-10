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

export type PortfolioHistory = {
  date: string
  value: number
  cost: number
}

export function getPortfolioHistory(assets: Asset[]): PortfolioHistory[] {
  const allDates = new Set<string>()

  assets.forEach((asset) => {
    asset.transactions.forEach((transaction) => {
      allDates.add(new Date(transaction.date).toLocaleDateString())
    })
  })

  const sortedDates = Array.from(allDates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const history: PortfolioHistory[] = []

  const latestPrices: Record<string, number> = {}
  const quantities: Record<string, number> = {}
  const assetCosts: Record<string, number> = {}

  assets.forEach((asset) => {
    latestPrices[asset.id] = 0
    quantities[asset.id] = 0
    assetCosts[asset.id] = 0
  })

  sortedDates.forEach((dateStr) => {
    assets.forEach((asset) => {
      const transactionOnThisDate = asset.transactions.filter(
        (transaction) =>
          new Date(transaction.date).toLocaleDateString() === dateStr
      )

      transactionOnThisDate.forEach((transaction) => {
        if (transaction.type === "buy") {
          assetCosts[asset.id] +=
            transaction.quantity * transaction.pricePerUnit
          quantities[asset.id] += transaction.quantity
          latestPrices[asset.id] = transaction.pricePerUnit
        } else if (transaction.type === "sell") {
          if (quantities[asset.id] > 0) {
            const proportionSold = transaction.quantity / quantities[asset.id]
            assetCosts[asset.id] -= assetCosts[asset.id] * proportionSold
          }
          quantities[asset.id] -= transaction.quantity
          latestPrices[asset.id] = transaction.pricePerUnit
        } else if (transaction.type === "update") {
          latestPrices[asset.id] = transaction.pricePerUnit
        }
      })
    })

    let runningValue = 0
    let runningCost = 0

    assets.forEach((asset) => {
      runningValue += quantities[asset.id] * latestPrices[asset.id]
      runningCost += assetCosts[asset.id]
    })

    history.push({
      date: dateStr,
      value: runningValue,
      cost: runningCost,
    })
  })

  if (history.length === 0 && assets.length > 0) {
    return [{ date: new Date().toLocaleDateString(), value: 0, cost: 0 }]
  }

  if (history.length > 0) {
    const firstDateStr = history[0].date
    const firstDate = new Date(firstDateStr)
    firstDate.setDate(firstDate.getDate() - 1)

    history.unshift({
      date: firstDate.toLocaleDateString(),
      value: 0,
      cost: 0,
    })
  }
  
  return history
}
