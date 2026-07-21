type OnBoardingThings = {
    hasAccounts: boolean
    hasCategories: boolean
    hasGoals: boolean
    hasTransactions: boolean
    onOpenSettings: () => void
    onCreateGoal: () => void
    onAddTransaction: () => void
}

export function onBoarding({ hasAccounts, hasCategories, hasGoals, hasTransactions, onOpenSettings, onCreateGoal, onAddTransaction }: OnBoardingThings) {
    const steps = [
        { id: 1, label: "Create your first account", description: "e.g., Checking or Savings", done: hasAccounts, action: onOpenSettings, actionLabel: "Open Settings" },
        { id: 2, label: "Create a category", description: "e.g., Food or Rent", done: hasCategories, action: onOpenSettings, actionLabel: "Open Settings" },
        { id: 3, label: "Set a savings goal", description: "What are you saving for?", done: hasGoals, action: onCreateGoal, actionLabel: "Add Goal" },
        { id: 4, label: "Add your first transaction", description: "Log an income or expense", done: hasTransactions, action: onAddTransaction, actionLabel: "Add Transaction" },
    ]

    const completedCount = steps.filter(step => step.done).length
    const progress = (completedCount / steps.length) * 100
}