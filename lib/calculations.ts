import type { Transaction } from "../types/transaction"

export function calculateIncome(
    transactions: Transaction[]
) {
    return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function calculateExpenses(
    transactions: Transaction[]
) {
    return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export type FilterPeriod = "today" | "week" |  "month" | "year" | "lifetime"

export function filterTransactionsByPeriod(transactions: Transaction[], period: FilterPeriod): Transaction[] {
    if (period === "lifetime") {
        return transactions
    }

    const now = new Date()
    return transactions.filter((transaction) => {
        const date = new Date(transaction.date)
        if (isNaN(date.getTime())) {
            return false
        }
        if (period === "today") {
            return (
                date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            )
        }
        if (period === "week") {
            const dateWeekAgo = new Date(now)
            dateWeekAgo.setDate(now.getDate() - 7)
            return date >= dateWeekAgo
        }
        if (period === "month") {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }
        if (period === "year") {
            return date.getFullYear() === now.getFullYear()
        }
        return true
    })
}