import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Rule } from "@/types/rule"
import type { Account } from "@/types/account"
import type { categoryCustomization } from "./categoryCustomization"
import type { Asset } from "@/types/asset"
import type { DashboardVisibility } from "@/types/dashboard"
import type { TransactionTemplate } from "@/types/template"

type AppBackupThings = {
    transactions: Transaction[]
    goals: Goal[]
    categories: string[]
    budgets: Record<string, number>
    currency: string
    recurring: RecurringTransaction[]
    rules: Rule[]
    accounts: Account[]
    assets?: Asset[]
    categoryCustomization: Record<string, categoryCustomization>
    defaultAccountId?: string
    accentColor?: string
    onboardingComplete?: boolean
    dashboardVisibility?: DashboardVisibility
    unlockedAchievements?: string[]
    templates?: TransactionTemplate[]
    appInstallDate?: string
}

export function exportToJSON(data: AppBackupThings, filename = "dimetrack-backup.json") {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export function importFromJSON(file: File): Promise<AppBackupThings | null> {
    return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const parsed = JSON.parse(text)

                if (
                    !Array.isArray(parsed.transactions) || 
                    !Array.isArray(parsed.categories) ||
                    !Array.isArray(parsed.goals) ||
                    !Array.isArray(parsed.recurring) ||
                    typeof parsed.budgets !== "object" || parsed.budgets === null ||
                    typeof parsed.currency !== "string"
                ) {
                    return resolve(null)
                }
                resolve(parsed as AppBackupThings)
            } catch (error) {
                resolve(null)
            }
        }
        reader.onerror = () => resolve(null)
        reader.readAsText(file)
    })
}