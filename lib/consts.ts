import type { RecurringTransaction } from "@/types/recurringTransaction"

export function savingsCategoryForGoal(goalName: string): string {
    return (
        `Savings: ${goalName}`
    )
}

export function isSavingsCategory(category: string): boolean {
    return (
        category.startsWith("Savings: ")
    )
}

export const recurringIntervalLabels: Record<RecurringTransaction["interval"], string> = {
    daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly", custom: "Custom"
}

export const DEFAULT_CATEGORY_COLOR = "#6b7280"
export const DEFAULT_CATEGORY_ICON = "Tag"
export const DEFAULT_ACCOUNT_ICON = "Wallet"

export const STARTING_BALANCE_CATEGORY = "Starting Balance"

export const ACCENT_COLORS = [
    {name: "Slate", hex: "#18181b"},
    {name: "Emerald", hex: "#10b981"},
    {name: "Ocean", hex: "#0ea5e9"},
    {name: "Royal", hex: "#8b5cf6"},
    {name: "Sunset", hex: "#f97316"},
    {name: "Rose", hex: "#f43f5e"},
]