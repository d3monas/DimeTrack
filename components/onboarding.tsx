import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"
import { Button } from "./ui/button"

type OnboardingThings = {
  hasAccounts: boolean
  hasCategories: boolean
  hasBudgets: boolean
  hasGoals: boolean
  hasTransactions: boolean
  onOpenSettings: () => void
  onCreateGoal: () => void
  onAddTransaction: () => void
  onComplete: () => void
}

export function Onboarding({ hasAccounts, hasCategories, hasBudgets, hasGoals, hasTransactions, onOpenSettings, onCreateGoal, onAddTransaction, onComplete }: OnboardingThings) {
  const [open, setOpen] = useState(false)

  const steps = [
    { id: 1, label: "Create your first account", description: "e.g., Checking or Savings", done: hasAccounts, action: () => { onOpenSettings(); setOpen(false) }, actionLabel: "Open Settings" },
    { id: 2, label: "Create a category", description: "e.g., Food or Rent", done: hasCategories, action: () => { onOpenSettings(); setOpen(false) }, actionLabel: "Open Settings" },
    { id: 3, label: "Set a budget limit", description: "Assign a limit to a category", done: hasBudgets, action: () => { onOpenSettings(); setOpen(false) }, actionLabel: "Open Settings" },
    { id: 3, label: "Set a savings goal", description: "What are you saving for?", done: hasGoals, action: () => { onCreateGoal(); setOpen(false) }, actionLabel: "Add Goal" },
    { id: 4, label: "Add your first transaction", description: "Log an income or expense", done: hasTransactions, action: () => { onAddTransaction(); setOpen(false) }, actionLabel: "Add Transaction" },
  ]

  const completedCount = steps.filter(step => step.done).length
  const progress = (completedCount / steps.length) * 100
  const allDone = completedCount === steps.length

  const handleComplete = () => {
    onComplete()
    setOpen(false)
  }

  return (
    <div className="mt-6 rounded-2xl border p-6 space-y-6 bg-muted/20">
      <div>
        <h2 className="text-xl font-bold">Welcome to Dimetrack! 👋</h2>
        <p className="text-sm text-muted-foreground mt-1">Complete these steps to get started</p>
      </div>

      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-3">
        {steps.map(step => (
          <div key={step.id} className={cn("flex items-center justify-between gap-4 p-3 rounded-md border", step.done ? "bg-background opacity-60" : "bg-background")}>
            <div className="flex items-center gap-3">
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <div>
                <p className={cn("font-medium text-sm", step.done && "line-through")}>{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {!step.done && (
              <Button variant="outline" size="sm" onClick={step.action}>{step.actionLabel}</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}