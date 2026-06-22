import { EmptyState } from "./emptyState"

type CategoryBreakdownThings = {
    totals: Record<string, number>
    currencySymbol: string
}

export function CategoryBreakdown({ totals, currencySymbol }: CategoryBreakdownThings) {
    const entries = Object.entries(totals).sort(([,a], [,b]) => b - a)

    if (entries.length === 0) {
        return (
            <div className="mt-6 rounded-2xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Spending by Category</h2>
                <EmptyState message="No expenses yet" />
            </div>
        )
    }

    return (
        <div className="mt-6 rounded-2xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Spending by Category</h2>

            <div className="space-y-3">
                {entries.map(([category, total]) => (
                    <div key={category} className="flex justify-between">
                        <span>{category}</span>
                        <span>{currencySymbol}{total.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}