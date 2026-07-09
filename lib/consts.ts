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