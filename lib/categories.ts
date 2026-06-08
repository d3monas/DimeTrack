import { Transaction } from "@/types/transaction"

export function getCategoryTotals(transactions: Transaction[]) {
    const totals: Record<string, number> = {}

    for (const t of transactions) {
        if (t.type !== "expense") continue
        totals[t.category] = (totals[t.category] || 0) + t.amount
    }
    return totals
}