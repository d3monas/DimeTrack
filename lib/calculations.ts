import type { Transaction } from "../types/transaction"
import { STARTING_BALANCE_CATEGORY } from "@/lib/consts"

export function calculateIncome(transactions: Transaction[]) {
    return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function calculateExpenses(transactions: Transaction[]) {
    return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export type FilterPeriod = "today" | "week" |  "month" | "year" | "lifetime"

export function filterTransactionsByPeriod(transactions: Transaction[], period: FilterPeriod): Transaction[] {
    if (period === "lifetime") {
        return transactions
    }

    const now = new Date()
    return transactions.filter((transaction) => {
        const date = new Date(transaction.date)
        if (isNaN(date.getTime())) {
            return false
        }
        if (period === "today") {
            return (
                date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            )
        }
        if (period === "week") {
            const dateWeekAgo = new Date(now)
            dateWeekAgo.setDate(now.getDate() - 7)
            return date >= dateWeekAgo
        }
        if (period === "month") {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }
        if (period === "year") {
            return date.getFullYear() === now.getFullYear()
        }
        return true
    })
}

export type MonthlyTrend = {
    month: string
    income: number
    expenses: number
}

export function getMonthlyTrends(transactions: Transaction[]): MonthlyTrend[] {
    const now = new Date()
    const trends: MonthlyTrend[] = []

    for (let i = 5; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = targetDate.toLocaleDateString('default', { month: 'short' })

        const monthTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.date)
            return (
                date.getMonth() === targetDate.getMonth() && date.getFullYear() === targetDate.getFullYear() && transaction.category !== STARTING_BALANCE_CATEGORY
            )
        })

        trends.push({
            month: monthName,
            income: monthTransactions.filter(transaction => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0),
            expenses: monthTransactions.filter(transaction => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0)
        })
    }
    return trends
}

export type NetWorthHistoryPoint = {
    month: string
    balance: number
}

export function getNetWorthHistory(transactions: Transaction[], months = 6): NetWorthHistoryPoint[] {
    const now = new Date()
    const history: NetWorthHistoryPoint[] = []

    const startRangeDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)
    const prevTransactions = transactions.filter(transaction => new Date(transaction.date) < startRangeDate)
    let runningBalance = calculateIncome(prevTransactions) - calculateExpenses(prevTransactions)

    for (let i = months - 1; i >= 0; i--) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthName = targetDate.toLocaleDateString("default", { month: "short" })

        const monthTransactions = transactions.filter(transaction => {
            const d = new Date(transaction.date)
            return (
                d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear()
            )
        })

        const monthIncome = calculateIncome(monthTransactions)
        const monthExpenses = calculateExpenses(monthTransactions)
        runningBalance += (monthIncome - monthExpenses)

        history.push({
            month: monthName,
            balance: runningBalance
        })
    }
    return history
}
