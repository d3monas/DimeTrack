export type Transaction = {
  id: string
  description: string
  amount: number
  type: "income" | "expense" | "transfer"
  category: string
  date: string
  notes?: string
  splits?: TransactionSplit[]
  accountId?: string
  transferAccountId?: string
}

export type TransactionSplit = {
  amount: number
  category: string
}