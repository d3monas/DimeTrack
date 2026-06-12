import { Transaction } from "@/types/transaction"
import { Goal } from "@/types/goal"

const isBrowser = typeof window !== "undefined"

export function saveTransactions(transactions: Transaction[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

export function saveGoal(goal: Goal) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("goal", JSON.stringify(goal))
}

export function saveCategories(categories: string[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("categories", JSON.stringify(categories))
}

export function saveBudgets(budgets: Record<string, number>) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("budgets", JSON.stringify(budgets))
}

export function loadTransactions(): Transaction[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("transactions")
        if (!saved) {
            return []
        }
        const parsed = JSON.parse(saved)
        if (!Array.isArray(parsed)) {
            return []
        }
        return parsed
    } catch {
        return []
    }
}

export function loadGoal(): Goal | null {
    if (!isBrowser) {
        return null
    } 
    try {
        const saved = localStorage.getItem("goal")
        if (!saved) return null
        const parsed = JSON.parse(saved)
        if (
            typeof parsed.name !== "string" ||
            typeof parsed.currentAmount !== "number" ||
            typeof parsed.targetAmount !== "number"
        ) {
            return null
        }
        return parsed
    } catch {
        return null
    }
}

export function loadCategories(): string[] {
    if (!isBrowser) {
        return []
    } 
    try {
        const saved = localStorage.getItem("categories")
        if (!saved) {
            return []
        }
        const parsed = JSON.parse(saved)
        if (!Array.isArray(parsed)) {
            return []
        }
        return parsed
    } catch {
        return []
    }
}

export function loadBudgets(): Record<string, number> {
    if (!isBrowser) {
        return {}
    } 
    try {
        const saved = localStorage.getItem("budgets")
        if (!saved) {
            return {}
        }
        const parsed = JSON.parse(saved)
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
            return {}
        }
        return parsed
    } catch {
        return {}
    }
}