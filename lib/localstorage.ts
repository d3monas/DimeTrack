import { Transaction } from "@/types/transaction"
import { Goal } from "@/types/goal"
import type { RecurringTransaction } from "@/types/recurringTransaction"

const isBrowser = typeof window !== "undefined"

// transactions
export function saveTransactions(transactions: Transaction[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("transactions", JSON.stringify(transactions))
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

// goal
function loadGoal(): Goal | null {
    if (!isBrowser) {
        return null
    } 
    try {
        const saved = localStorage.getItem("goal")
        if (!saved) {
            return null
        }
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

// new localstorage save for multiple goals
export function saveGoals(goals: Goal[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("goals", JSON.stringify(goals))
}

export function loadGoals(): Goal[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("goals")
        if (saved) {
            const parsed = JSON.parse(saved)
            if (Array.isArray(parsed)) {
                return parsed
            }
        }

        // old goal migration
        const oldGoal = loadGoal()
        if (oldGoal) {
            const migrated: Goal[] = [{
                id: crypto.randomUUID(),
                name: oldGoal.name,
                currentAmount: oldGoal.currentAmount,
                targetAmount: oldGoal.targetAmount,
            }]
            localStorage.setItem("goals", JSON.stringify(migrated))
            localStorage.removeItem("goal")
            return migrated
        }
        return []
    } catch {
        return []
    }
}

// categories
export function saveCategories(categories: string[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("categories", JSON.stringify(categories))
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

// budget
export function saveBudgets(budgets: Record<string, number>) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("budgets", JSON.stringify(budgets))
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

// currency
export function saveCurrency(currency: string) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("currency", currency)
}

export function loadCurrency(): string {
    if (!isBrowser) {
        return "USD"
    }
    return localStorage.getItem("currency") || "USD"    
}

// recurring transactions
export function saveRecurring(recurring: RecurringTransaction[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("recurring", JSON.stringify(recurring))
}

export function loadRecurring(): RecurringTransaction[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("recurring")
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

export function loadAllData() {
    return {
        transactions: loadTransactions(),
        categories: loadCategories(),
        budgets: loadBudgets(),
        goals: loadGoals(),
        currency: loadCurrency(),
        recurring: loadRecurring(),
    }
}