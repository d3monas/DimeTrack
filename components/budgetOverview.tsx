import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type BudgetOverviewThings = {
  totals: Record<string, number>
  budgets: Record<string, number>
  onUpdateBudget: (category: string, limit: number) => void
}

export function BudgetOverview({ totals, budgets, onUpdateBudget }: BudgetOverviewThings) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState("")

  const allCategories = Object.keys(budgets)

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
      <div className="mt-6 rounded-2xl border p-6">
        <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>
        <p className="text-muted-foreground">No categories yet! Create some in settings to get started</p>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-2xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">Budget Overview</h2>

      <div className="space-y-5">
        {allCategories.map((category) => {
          const limit = budgets[category] ?? 0
          const spent = totals[category] ?? 0
          const hasLimit = limit > 0
          const progress = hasLimit ? (spent / limit) * 100 : 0
          const isOver = hasLimit && progress > 100
          const isEditing = editingCategory === category


          return (
            <div key={category}>
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium">{category}</span>

                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
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
                  <div className="flex items-center gap-3">
                    {hasLimit ? (
                      <span className={`text-sm ${isOver ? "text-red-600 font-medium" : "text-muted-foreground"}`}>${spent.toFixed(2)} / ${limit.toFixed(2)}</span>
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
                    className={`h-full rounded-full transition-all ${isOver ? "bg-red-600" : "bg-green-600"}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
    </div>
        </div>
  )
}