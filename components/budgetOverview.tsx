type BudgetOverviewThings = {
  totals: Record<string, number>
  budgets: Record<string, number>
}

export function BudgetOverview({ totals, budgets }: BudgetOverviewThings) {
  const activeBudgets = Object.entries(budgets).filter(([, limit]) => limit > 0)
  return (
    <div className="mt-6 rounded-2xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>

      {activeBudgets.length === 0 ? (
        <p className="text-muted-foreground">No budgets set yet</p>
      ) : (
        <div className="space-y-4">
          {activeBudgets.map(([category, limit]) => {
            const spent = totals[category] ?? 0
            const progress = (spent / limit) * 100
            const isOver = progress > 100

            return (
              <div key={category}>
                <div className="flex justify-between">
                  <span>{category}</span>
                  <span className={isOver ? "text-red-600 font-medium" : ""}>${spent.toFixed(2)} / ${limit.toFixed(2)}</span>
                </div>

                <div className="mt-2 h-3 rounded-full bg-muted">
                  <div className={`h-full rounded-full transition-all ${isOver ? "bg-red-600" : "bg-green-600"}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}