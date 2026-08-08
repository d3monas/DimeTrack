export type InvestmentType = "Stock" | "ETF" | "Crypto" | "Other"

export type InvestmentTransaction = {
  id: string
  type: "buy" | "sell" | "update"
  date: string
  quantity: number
  pricePerUnit: number
  notes?: string
}

export type Asset = {
  id: string
  name: string
  ticker?: string
  type: InvestmentType
  notes?: string
  transactions: InvestmentTransaction[]
}