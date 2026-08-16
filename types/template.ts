export type TransactionTemplate = {
    id: string
    name: string
    description: string
    amount: number
    type: "income" | "expense" | "transfer"
    category: string
    accountId?: string
    notes?: string
}