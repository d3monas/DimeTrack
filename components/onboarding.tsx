import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, Circle, Sparkles } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to DimeTrack! 👋</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground -mt-2">Complete these steps to setup your dashboard</p>
      </DialogContent>
    </Dialog>
  )
}