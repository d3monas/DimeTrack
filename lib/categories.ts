import { Transaction } from "@/types/transaction"

export function getCategoryTotals(transactions: Transaction[]) {
    const totals: Record<string, number> = {}

    transactions.forEach((transaction) => {
        if (transaction.type !== "income")
            return totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount
    })

    return totals
}