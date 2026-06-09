import { Transaction } from "@/types/transaction"
import { Goal } from "@/types/goal"

export function saveTransactions(transactions: Transaction[]) {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

export function saveGoal(goal: Goal) {
    localStorage.setItem("goal", JSON.stringify(goal))
}

export function saveCategories(categories: string[]) {
    localStorage.setItem("categories", JSON.stringify(categories))
}

export function saveBudgets(budgets: Record<string, number>) {
    localStorage.setItem("budgets", JSON.stringify(budgets))
}

export function loadTransactions(): Transaction[] {
    const saved = localStorage.getItem("transactions")

    if (!saved) {
        return []
    }

    return JSON.parse(saved)
}

export function loadGoal(): Goal | null {
    const saved = localStorage.getItem("goal")

    if (!saved) { 
        return null
    }

    try { 
        const parsed = JSON.parse(saved)

        if (
            typeof parsed.name !== "string" ||
            typeof parsed.currentAmount !== "number" ||
            typeof parsed.targetAmount !== "number"
        ) {
            return null
        }
        return parsed
    }

    catch {
        return null
    }
}

export function loadCategories(): string[] {
    const saved = localStorage.getItem('categories')

    if (!saved) {
        return []
    }

    return JSON.parse(saved)
}

export function loadBudgets(): Record<string, number> {
    const saved = localStorage.getItem("budgets")

    if (!saved) {
        return {}
    }

    return JSON.parse(saved)
}