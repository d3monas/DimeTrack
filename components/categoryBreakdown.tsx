type Things = {
    totals: Record<string, number>
}

export function CategoryBreakdown({ totals }: Things) {
    const entries = Object.entries(totals).sort(([,a], [,b]) => b - a)

    if (Object.keys(totals).length === 0) {
        return (
            <div className="rounded-2xl border p-6 mt-2">
                <p className="text-muted-foreground">No spending categories yet</p>
            </div>
        )
    }

    if (entries.length === 0) {
        return (
            <div className="mt-6 rounded-2xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Spending by Category</h2>
                <p className="text-muted-foreground">No expenses yet</p>
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
                        <span>${total.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}