import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EmptyState } from "./emptyState"

type BudgetOverviewThings = {
  totals: Record<string, number>
  budgets: Record<string, number>
  onUpdateBudget: (category: string, limit: number) => void
  currencySymbol: string
  monthlyIncome: number
}

function getBarColor(progress: number) {
  if (progress >= 100) {
    return "bg-red-600"
  }
  if (progress >= 80) {
    return "bg-orange-500"
  }
  if (progress >= 50) {
    return "bg-yellow-500"
  }
  return "bg-green-600"
}

function getTextColor(progress: number) {
  if (progress >= 100) {
    return "text-red-600 font-medium"
  }
  if (progress >= 80) {
    return "text-orange-500 font-medium"
  }
  if (progress >= 50) {
    return "text-yellow-500 font-medium"
  }
  return "font-medium"
}

function getWarning(progress: number) {
  if (progress >= 100) {
    return "Over budget"
  }
  if (progress >= 80) {
    return "Approaching limit"
  }
  return null
}

export function BudgetOverview({ totals, budgets, onUpdateBudget, currencySymbol, monthlyIncome }: BudgetOverviewThings) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")

  const allCategories = Object.keys(budgets)
  
  const totalAssigned = Object.values(budgets).reduce((sum, limit) => sum + limit, 0)
  const availableToBudget = monthlyIncome - totalAssigned
  const totalSpent = Object.values(totals).reduce((sum, spent) => sum + spent, 0)

  function editStart(category: string, currentLimit: number) {
    setEditingCategory(category)
    setEditingValue(currentLimit > 0 ? currentLimit.toString() : "")
  }

  function editSave(category: string) {
    const parsed = Number(editingValue)
    if (!editingValue || Number.isNaN(parsed) || parsed <= 0) {
      setEditingCategory(null)
      return
    }
    onUpdateBudget(category, parsed)
    setEditingCategory(null)
    setEditingValue("")
  }

  function editCancel() {
    setEditingCategory(null)
    setEditingValue("")
  }

  if (allCategories.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>
        <EmptyState message="You don't have any categories yet. Create some in settings" />
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-2xl border p-4 sm:p-6">
      <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>

      <div className={`mb-6 rounded-xl p-4 ${availableToBudget < 0 ? "bg-red-500/10" : "bg-green-500/10"}`}>
        <p className="text-sm text-muted-foreground">Ready to Budget (This Month)</p>
        <h3 className={`text-2xl font-bold ${availableToBudget < 0 ? "text-red-600" : "text-green-600"}`}>{currencySymbol}{availableToBudget.toFixed(2)}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {availableToBudget < 0 ? "You have assigned more money than you earned this month" : availableToBudget === 0 ? "You have assigned all your money this month" : "Assign the remaining income to your categories"}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Income: </span>
          <span className="font-medium text-green-600">{currencySymbol}{monthlyIncome.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Assigned: </span>
          <span className="font-medium">{currencySymbol}{totalAssigned.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Spent: </span>
          <span className="font-medium text-red-600">{currencySymbol}{totalSpent.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-5">
        {allCategories.map((category) => {
          const limit = budgets[category] ?? 0
          const spent = totals[category] ?? 0
          const hasLimit = limit > 0
          const progress = hasLimit ? (spent / limit) * 100 : 0
          const isEditing = editingCategory === category
          const warning = hasLimit ? getWarning(progress) : null

          return (
            <div key={category}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{category}</span>

                {isEditing ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">{currencySymbol}</span>
                    <Input
                      className="h-8 w-24 text-sm"
                      placeholder="0.00"
                      autoFocus
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          editSave(category)
                        }
                        if (e.key === "Escape") {
                          editCancel()
                        }
                      }}
                    />
                    <Button size="sm" className="h-8" onClick={() => editSave(category)}>Save</Button>
                    <Button size="sm" className="h-8" variant="ghost" onClick={editCancel}>Cancel</Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    {hasLimit ? (
                      <span className={`text-sm ${getTextColor(progress)}`}>{currencySymbol}{spent.toFixed(2)} / {currencySymbol}{limit.toFixed(2)}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">No limit set</span>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => editStart(category, limit)}>{hasLimit ? "Edit" : "Set budget"}</Button>
                  </div>
                )}
              </div>

              {hasLimit && !isEditing && (
                <div className="mt-2 h-3 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(progress)}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              )}
              {warning && (
                <p className={`mt-1 text-xs ${progress >= 100 ? "text-red-600" : "text-orange-500"}`}>⚠ {warning}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}