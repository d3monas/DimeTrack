import type { RecurringTransaction } from "@/types/recurringTransaction";
import type { Transaction } from "@/types/transaction";

function addMonthsClamped(date: Date, months: number): Date {
    const day = date.getDate()
    const result = new Date(date)
    result.setDate(1)
    result.setMonth(result.getMonth() + months)
    const lastDayOfTargetMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate()
    result.setDate(Math.min(day, lastDayOfTargetMonth))
    return result
}

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
            return addMonthsClamped(date, 1)
        case "yearly":
            date.setFullYear(date.getFullYear() +1)
            break;
        case "custom": {
            const value = Math.max(1, recurring.customIntervalValue ?? 1)
            const unit = recurring.customIntervalUnit ?? "days"
            if (unit === "days") {
                date.setDate(date.getDate() + value)
            }
            if (unit === "weeks") {
                date.setDate(date.getDate() + value * 7)
            }
            if (unit === "months") {
                return addMonthsClamped(date, value)
            }
            break
        }
    }
    return date
}

const MAX_CATCHUP_OCCURRENCES = 60

export function processRecurring(recurring: RecurringTransaction[]): { newTransactions: Transaction[], updatedRecurring: RecurringTransaction[]} {
    const now = new Date()
    const newTransactions: Transaction[] = []

    const updatedRecurring = recurring.map((recurring) => {
        if (recurring.isActive === false) {
            return recurring
        }
        
        let current = recurring
        let nextDate = getNextDate(current)
        let count = 0

        while (nextDate <= now && count < MAX_CATCHUP_OCCURRENCES) {
            newTransactions.push({
                id: crypto.randomUUID(),
                description: current.description,
                amount: current.amount,
                type: current.type,
                category: current.category,
                date: nextDate.toISOString(),
                accountId: current.accountId,
                transferAccountId: current.transferAccountId,
            })
            current = {...current, lastProcessedDate: nextDate.toISOString()}
            nextDate = getNextDate(current)
            count++
        }
        return current
    })
    return { 
        newTransactions, updatedRecurring 
    }
}