import { RecurringTransaction } from "@/types/recurringTransaction";

export type SubscriptionMetrics = {
    monthlyTotal: number
    annualTotal: number
    activeCount: number
}

export function getSubscriptionMetrics(recurring: RecurringTransaction[]): SubscriptionMetrics {
    const activeSubs = recurring.filter(recurring => recurring.type === "expense" && recurring.isActive !== false)

    let monthlyTotal = 0

    activeSubs.forEach(sub => {
        let monthlyCost = 0
        const amount = sub.amount

        if (sub.interval === "monthly") {
            monthlyCost = amount
        } else if (sub.interval === "yearly") {
            monthlyCost = amount / 12
        } else if (sub.interval === "weekly") {
            monthlyCost = (amount * 52) / 12
        } else if (sub.interval === "daily") {
            monthlyCost = (amount * 365) / 12
        } else if (sub.interval === "custom") {
            const val = sub.customIntervalValue ?? 1
            if (sub.customIntervalUnit === "months") {
                monthlyCost = amount / val
            }
            if (sub.customIntervalUnit === "weeks") {
                monthlyCost = (amount * 52) / 12 / val
            }
            if (sub.customIntervalUnit === "days") {
                monthlyCost = (amount * 365) / 12 / val
            }
        }
        monthlyTotal += monthlyCost
    })

    return {
        monthlyTotal,
        annualTotal: monthlyTotal * 12,
        activeCount: activeSubs.length
    }
}