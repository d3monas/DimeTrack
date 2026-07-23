import type { Transaction } from "../types/transaction"
import { STARTING_BALANCE_CATEGORY } from "@/lib/consts"
import { getCategoryTotals } from "./categories"

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

export type MonthlyReportData = {
    income: number
    expenses: number
    savings: number
    savingsRate: number
    topCategory: {name: string; amount: number} | null
    largestPurchase: {description: string; amount: number} | null
    dailyAverage: number
    prevExpenses: number
    expenseDiff: number
}

export function getMonthlyReportData(transactions: Transaction[]): MonthlyReportData {
    const now = new Date()
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const thisMonth = transactions.filter(transaction => {
        const date = new Date(transaction.date)
        return (
            date >= startOfThisMonth && date < now && transaction.category !== STARTING_BALANCE_CATEGORY
        )
    })

    const prevMonth = transactions.filter(transaction => {
        const date = new Date(transaction.date)
        return (
            date >= startOfPrevMonth && date < startOfThisMonth && transaction.category !== STARTING_BALANCE_CATEGORY
        )
    })

    const income = calculateIncome(thisMonth)
    const expenses = calculateExpenses(thisMonth)
    const savings = income - expenses
    const savingsRate = income > 0 ? (savings / income) * 100 : 0

    const categoryTotals = getCategoryTotals(thisMonth)
    const topCategoryEntry = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0]
    const topCategory = topCategoryEntry ? { name: topCategoryEntry[0], amount: topCategoryEntry[1]} : null

    const expensesOnly = thisMonth.filter(transaction => transaction.type === "expense")
    const largest = expensesOnly.sort((a, b) => b.amount - a.amount)[0]
    const largestPurchase = largest ? { description: largest.description, amount: largest.amount} : null

    const dayOfMonth = now.getDate()
    const dailyAverage = dayOfMonth > 0 ? expenses / dayOfMonth : 0

    const prevExpenses = calculateExpenses(prevMonth)
    const expenseDiff = expenses - prevExpenses

    return {
        income, expenses, savings, savingsRate, topCategory, largestPurchase, dailyAverage, prevExpenses, expenseDiff
    }
}