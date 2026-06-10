type BudgetOverviewProps = {
  totals: Record<string, number>
  budgets: Record<string, number>
}

export function BudgetOverview({
  totals, budgets
}: BudgetOverviewProps) {
  return (
    <div className="mt-6 rounded-2xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>

      <div className="space-y-4">
        {Object.entries(budgets).map(([category, limit]) => {
          const spent = totals[category] ?? 0
          const progress = (spent / limit) * 100

          return (
            <div key={category}>
              <div className="flex justify-between">
                <span>{category}</span>
                <span>${spent.toFixed(2)} / ${limit.toFixed(2)}</span>
              </div>

              <div className="mt-2 h-3 rounded-full bg-muted">
                <div className="h-full rounded-full bg-green-600" style={{width: `${Math.min(progress, 100)}%`}} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}