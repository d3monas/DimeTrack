import type { RecurringTransaction } from "@/types/recurringTransaction";
import type { Transaction } from "@/types/transaction";

export function getNextDate(recurring: RecurringTransaction): Date {
    const date = new Date(recurring.lastProcessedDate)
    switch (recurring.interval) {
        case "daily":
            date.setDate(date.getDate() +1)
            break;
        case "weekly":
            date.setDate(date.getDate() +7)
            break;
        case "monthly":
            date.setMonth(date.getMonth() +1)
            break;
        case "yearly":
            date.setFullYear(date.getFullYear() +1)
            break;
        case "custom": {
            const value = recurring.customIntervalValue ?? 1
            const unit = recurring.customIntervalUnit ?? "days"
            if (unit === "days") {
                date.setDate(date.getDate() + value)
            }
            if (unit === "weeks") {
                date.setDate(date.getDate() + value * 7)
            }
            if (unit === "months") {
                date.setMonth(date.getMonth() + value)
            }
            break
        }
    }
    return date
}

export function processRecurring(recurring: RecurringTransaction[]): { newTransactions: Transaction[], updatedRecurring: RecurringTransaction[]} {
    const now = new Date()
    const newTransactions: Transaction[] = []
    const updatedRecurring = recurring.map((recurring) => {
        let current = recurring
        let nextDate = getNextDate(current)

        while (nextDate <= now) {
            newTransactions.push({
                id: crypto.randomUUID(),
                description: current.description,
                amount: current.amount,
                type: current.type,
                category: current.category,
                date: new Date().toISOString(),
            })
            current = {...current, lastProcessedDate: nextDate.toISOString()}
            nextDate = getNextDate(current)
        }
        return current
    })
    return { 
        newTransactions, updatedRecurring 
    }
}