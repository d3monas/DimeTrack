import type { RecurringTransaction } from "@/types/recurringTransaction";
import type { Transaction } from "@/types/transaction";

export function getNextDate(lastProcessedDate: string, interval: RecurringTransaction["interval"]): Date {
    const date = new Date(lastProcessedDate)
    switch (interval) {
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
    }
    return date
}

export function processRecurring(recurring: RecurringTransaction[]): { newTransactions: Transaction[], updatedRecurring: RecurringTransaction[]} {
    const now = new Date()
    const newTransactions: Transaction[] = []
    const updatedRecurring = recurring.map((recurring) => {
        const nextDate = getNextDate(recurring.lastProcessedDate, recurring.interval)
        if (nextDate <= now) {
            newTransactions.push({
                id: crypto.randomUUID(),
                description: recurring.description,
                amount: recurring.amount,
                type: recurring.type,
                category: recurring.category,
                date: new Date().toISOString(),
            })
            return {
                ...recurring, lastProcessedDate: new Date().toISOString()
            }
        }
        return recurring
    })
    return { 
        newTransactions, updatedRecurring 
    }
}