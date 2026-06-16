export type RecurringTransaction = {
    id: string
    description: string
    amount: number
    type: "income" | "expense"
    category: string
    interval: "daily" | "weekly" | "monthly" | "yearly"
    lastProcessedDate: string
}