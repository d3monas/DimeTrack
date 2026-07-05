import { Transaction } from "@/types/transaction"

export function getCategoryTotals(transactions: Transaction[]) {
    const totals: Record<string, number> = {}

    for (const t of transactions) {
        if (t.type !== "expense") {
            continue
        }

        if (t.splits && t.splits.length > 0) {
            for (const split of t.splits) {
                totals[split.category] = (totals[split.category] || 0) + split.amount
            }
        } else {
            totals[t.category] = (totals[t.category] || 0) + t.amount
        }
    }
    return totals
}