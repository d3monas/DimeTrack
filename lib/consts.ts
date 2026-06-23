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