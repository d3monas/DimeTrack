export type RecurringTransaction = {
    id: string
    description: string
    amount: number
    type: "income" | "expense" | "transfer"
    category: string
    interval: "daily" | "weekly" | "monthly" | "yearly" | "custom"
    customIntervalValue?: number
    customIntervalUnit?: "days" | "weeks" | "months"
    lastProcessedDate: string
    createdAt: string
}