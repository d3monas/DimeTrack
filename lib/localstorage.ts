import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Rule } from "@/types/rule"
import { categoryCustomization } from "@/lib/categoryCustomization"
import type { Account } from "@/types/account"
import type { Asset } from "@/types/asset"
import { DashboardVisibility } from "@/types/dashboard"
import { TransactionTemplate } from "@/types/template"

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

// category customization
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

// accounts
export function saveAccounts(accounts: Account[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("accounts", JSON.stringify(accounts))
}

export function loadAccounts(): Account[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("accounts")
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

// default account
export function saveDefaultAccountId(id: string) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("defaultAccountId", id)
}

export function loadDefaultAccountId(): string {
    if (!isBrowser) {
        return ""
    }
    return (
        localStorage.getItem("defaultAccountId") || ""
    )
}

// accent color
export function saveAccentColor(color: string) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("accentColor", color)
}

export function loadAccentColor(): string {
    if (!isBrowser) {
        return ""
    }
    return (
        localStorage.getItem("accentColor") || ""
    )
}

// onboarding
export function saveOnboardingComplete(isComplete: boolean) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("onboardingComplete", JSON.stringify(isComplete))
}

export function loadOnboardingComplete(): boolean {
    if (!isBrowser) {
        return false
    }
    return (
        JSON.parse(localStorage.getItem("onboardingComplete") || "false")
    )
}

// tutorial
export function saveTutorialSeen(seen: boolean) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("tutorialSeen", JSON.stringify(seen))
}

export function loadTutorialSeen(): boolean {
    if (!isBrowser) {
        return false
    }
    return (
        JSON.parse(localStorage.getItem("tutorialSeen") || "false")
    )
}

// sync
export function saveSyncId(id: string) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("syncId", id)
}

export function loadSyncId(): string {
    if (!isBrowser) {
        return ""
    }
    return (
        localStorage.getItem("syncId") || ""
    )
}

// assets
export function saveAssets(assets: Asset[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("assets", JSON.stringify(assets))
}

export function loadAssets(): Asset[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("assets")
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

// dashboard visiblity
const defaultDashboardVisibility: DashboardVisibility = {
    networth: true,
    networth_history: true,
    upcoming: true,
    smart_stats: true,
    trend: true,
    forecast: true,
    accounts: true,
    breakdown: true,
}

export function saveDashboardVisibility(visibility: DashboardVisibility) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("dashboardVisibility", JSON.stringify(visibility))
}

export function loadDashboardVisibility(): DashboardVisibility {
    if (!isBrowser) {
        return defaultDashboardVisibility
    }
    try {
        const saved = localStorage.getItem("dashboardVisibility")
        if (!saved) {
            return defaultDashboardVisibility
        }
        const parsed = JSON.parse(saved)
        return {
            ...defaultDashboardVisibility, ...parsed
        }
    } catch {
        return defaultDashboardVisibility
    }
}

// achievs
export function saveUnlockedAchievements(ids: string[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("unlockedAchievements", JSON.stringify(ids))
}

export function loadUnlockedAchievements(): string[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("unlockedAchievements")
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

// templates
export function saveTemplates(templates: TransactionTemplate[]) {
    if (!isBrowser) {
        return
    }
    localStorage.setItem("templates", JSON.stringify(templates))
}

export function loadTemplates(): TransactionTemplate[] {
    if (!isBrowser) {
        return []
    }
    try {
        const saved = localStorage.getItem("templates")
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

// app install date
export function loadAppInstallDate(): string {
    if (!isBrowser) {
        return new Date().toISOString()
    }
    const saved = localStorage.getItem("appInstallDate")
    if (saved) {
        return saved
    }

    const now = new Date().toISOString()
    localStorage.setItem("appInstallDate", now)
    return now
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
        accounts: loadAccounts(),
        defaultAccountId: loadDefaultAccountId(),
        accentColor: loadAccentColor(),
        onboardingComplete: loadOnboardingComplete(),
        tutorialSeen: loadTutorialSeen(),
        syncId: loadSyncId(),
        assets: loadAssets(),
        dashboardVisibility: loadDashboardVisibility(),
        achievements: loadUnlockedAchievements(),
        templates: loadTemplates(),
        appInstallDate: loadAppInstallDate(),
    }
}


export function clearAllData() {
    if (!isBrowser) {
        return
    }
    localStorage.removeItem("transactions")
    localStorage.removeItem("goal")
    localStorage.removeItem("goals")
    localStorage.removeItem("categories")
    localStorage.removeItem("budgets")
    localStorage.removeItem("currency")
    localStorage.removeItem("recurring")
    localStorage.removeItem("rules")
    localStorage.removeItem("categoryCustomization")
    localStorage.removeItem("accounts")
    localStorage.removeItem("defaultAccountId")
    localStorage.removeItem("accentColor")
    localStorage.removeItem("onboardingComplete")
    localStorage.removeItem("tutorialSeen")
    localStorage.removeItem("syncId")
    localStorage.removeItem("assets")
    localStorage.removeItem("dashboardVisibility")
    localStorage.removeItem("unlockedAchievements")
    localStorage.removeItem("templates")
}