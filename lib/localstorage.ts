import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Rule } from "@/types/rule"
import { categoryCustomization } from "@/lib/categoryCustomization"

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

// rules
export function saveRules(rules: Rule[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("rules", JSON.stringify(rules))
}

export function loadRules(): Rule[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("rules")
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

// category meta
export function saveCategoryCustomization(customization: Record<string, categoryCustomization>) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("categoryCustomization", JSON.stringify(customization))
}

export function loadCategoryCustomization(): Record<string, categoryCustomization> {
    if (!isBrowser) {
        return {}
    }
    try {
        const saved = localStorage.getItem("categoryCustomization")
        if (!saved) {
            return {}
        }
        const parsed = JSON.parse(saved)
        if (typeof parsed !== "object" || parsed === null) {
            return {}
        }
        return parsed
    } catch {
        return {}
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
        rules: loadRules(),
        categoryCustomization: loadCategoryCustomization(),
    }
}

export function clearAllData() {
    if (!isBrowser) {
        return
    }
    localStorage.removeItem("transactions")
    localStorage.removeItem("goals")
    localStorage.removeItem("categories")
    localStorage.removeItem("budgets")
    localStorage.removeItem("currency")
    localStorage.removeItem("recurring")
    localStorage.removeItem("rules")
    localStorage.removeItem("categoryCustomization")
}