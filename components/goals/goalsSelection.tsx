import { useState } from "react"
import { GoalCard } from "./goalCard"
import { PaginationUI } from "../paginationUI"
import { Button } from "../ui/button"
import { EmptyState } from "../emptyState"
import type { Goal } from "@/types/goal"
import type { Transaction } from "@/types/transaction"

type GoalsSelectionThings = {
    goals: Goal[]
    transactions: Transaction[]
    currencySymbol: string
    budgets: Record<string, number>
    onCreateGoal: () => void
    onEditGoal: (goal: Goal) => void
    onDeleteGoal: (id: string) => void
    onContribute: (goalId: string, amount: number) => void
}

export function GoalsSelection({ goals, transactions, currencySymbol, budgets ,onCreateGoal, onEditGoal, onDeleteGoal, onContribute }: GoalsSelectionThings) {
    const [index, setIndex] = useState(0)
    const currentIndex = Math.min(index, Math.max(0, goals.length - 1))
    const currentGoal = goals[currentIndex]

    if (goals.length === 0) {
        return (
            <div className="mt-6 rounded-2xl border p-4 sm:p-6">
                <h2 className="text-xl font-semibold">Savings Goal</h2>
                <EmptyState message="You haven't set a savings goal yet. Create one to start tracking progress" />
                <Button size="lg" variant="default" onClick={onCreateGoal} className="mt-2">Create goal</Button>
            </div>
        )
    }

    const progress = (currentGoal.currentAmount / currentGoal.targetAmount) * 100
    const remaining = currentGoal.targetAmount - currentGoal.currentAmount

    return (
        <div>
            <GoalCard goal={currentGoal} progress={progress} remaining={remaining} onEdit={() => onEditGoal(currentGoal)}
                onDelete={() => {
                    onDeleteGoal(currentGoal.id)
                    setIndex(0)
                }}
                onContribute={(amount) => onContribute(currentGoal.id, amount)}
                currencySymbol={currencySymbol}
                transactions={transactions}
            />
            <div className="mt-3 flex items-center justify-between">
                <PaginationUI currentPage={currentIndex} totalPages={goals.length} onPrev={() => setIndex((i) => i - 1)} onNext={() => setIndex((i) => i + 1)} />
                <Button size="sm" variant="outline" onClick={onCreateGoal}>New Goal</Button>
            </div>
        </div>
    )
}