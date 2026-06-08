import { Transaction } from "@/types/transaction"

type SpendingByCategory = {
    category: string
    amount: number
}

export function getSpendingByCategory(transactions: Transaction[]) {
    const map = new Map<string, number>()

    for (const t of transactions) {
        if (t.type !== "expense") {
            continue
        }
        const prev = map.get(t.category) ?? 0
        map.set(t.category, prev + t.amount)
    }
    return Array.from(map.entries()).map(([category, total]) => ({ category, total}))
}

export function getCategoryTop(transactions: Transaction[]) {
    const grouped = getSpendingByCategory(transactions)

    return grouped.reduce((max, curr) => 
        curr.total > max.total ? curr : max, 
        grouped[0] ?? {category: "None", total: 0}
    )
}

export function getCategoryTotals(transactions: Transaction[]) {
    const totals: Record<string, number> = {}

    for (const t of transactions) {
        if (t.type !== "expense") {
            continue
        }
        totals[t.category] = (totals[t.category] || 0) + t.amount
    }
    return totals
}