export type Transaction = {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  notes?: string
  splits?: TransactionSplit[]
}

export type TransactionSplit = {
  amount: number
  category: string
}