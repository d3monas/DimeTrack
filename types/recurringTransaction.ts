export type RecurringTransaction = {
    id: number
    description: string
    amount: number
    type: "income" | "expense"
    category: string
    interval: "daily" | "weekly" | "monthly" | "yearly"
    lastProcessedDate: string
}