import type { Transaction } from "../../types/transaction"
import { STARTING_BALANCE_CATEGORY } from "@/lib/consts"
import { getCategoryTotals } from "../categories"
import { RecurringTransaction } from "@/types/recurringTransaction"
import type { Goal } from "@/types/goal"
import type { Asset } from "@/types/asset"

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

export type ForecastPoint = {
    month: string
    balance: number
}

export function get12MonthForecast(currentBalance: number, recurring: RecurringTransaction[]): ForecastPoint[] {
    const now = new Date()
    
    const activeRecurring = recurring.filter(recurring => recurring.isActive !== false)
    if (activeRecurring.length === 0) {
        return []
    }
    
    const forecast: ForecastPoint[] = []
    let runningBalance = currentBalance
    
    forecast.push({ month: "Now", balance: runningBalance })
    for (let i = 1; i <= 12; i++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() + i, 1)
        const monthName = targetDate.toLocaleDateString("default", { month: "short" })

        let monthlyNetChange = 0

        activeRecurring.forEach(recurring => {
            let monthlyCost = 0
            const amount = recurring.amount

            if (recurring.interval === "monthly") {
                monthlyCost = amount
            } else if (recurring.interval === "yearly") {
                monthlyCost = amount / 12
            } else if (recurring.interval === "weekly") {
                monthlyCost = (amount * 52) / 12
            } else if (recurring.interval === "daily") {
                monthlyCost = (amount * 365) / 12
            } else if (recurring.interval === "custom") {
                const val = recurring.customIntervalValue ?? 1
                if (recurring.customIntervalUnit === "months") {
                    monthlyCost = amount / val
                }
                if (recurring.customIntervalUnit === "weeks") {
                    monthlyCost = (amount * 52) / 12 / val
                }
                if (recurring.customIntervalUnit === "days") {
                    monthlyCost = (amount * 365) / 12 / val
                }
            }
            
            monthlyNetChange += recurring.type === "income" ? monthlyCost : -monthlyCost
        })
        runningBalance += monthlyNetChange
        forecast.push({ month: monthName, balance: runningBalance })
    }
    return forecast
}

export type Insight = {
    text: string
    type: "positive" | "negative" | "warning" | "info"
}

export function getFinancialInsights(
    income: number,
    expenses: number,
    prevExpenses: number,
    categoryTotals: Record<string, number>,
    budgets: Record<string, number>,
    goals: Goal[],
    assets: Asset[],
    prevBalance: number,
    balance: number,
    currencySymbol: string
    ): Insight[] {
    const insights: Insight[] = []
    const now = new Date()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dayOfMonth = now.getDate()
    const daysLeft = daysInMonth - dayOfMonth

    if (prevExpenses > 0 && expenses > 0) {
        const diff = prevExpenses - expenses
        const pctChange = (diff / prevExpenses) * 100
        if (pctChange > 5) {
        insights.push({
            text: `Spending is down ${pctChange.toFixed(0)}%. You've spent ${currencySymbol}${diff.toFixed(2)} less than last month.`,
            type: "positive",
        })
        } else if (pctChange < -5) {
        insights.push({
            text: `Spending is up ${Math.abs(pctChange).toFixed(0)}%. You've spent ${currencySymbol}${Math.abs(diff).toFixed(2)} more than last month.`,
            type: "negative",
        })
        }
    }

    if (income > 0) {
        const savings = income - expenses
        if (savings > 0) {
        const savingsRate = (savings / income) * 100
        insights.push({
            text: `You've saved ${currencySymbol}${savings.toFixed(2)} this month, putting your savings rate at ${savingsRate.toFixed(0)}%`,
            type: "info",
        })
        } else if (savings < 0) {
        insights.push({
            text: `You are spending more than you earn this month by ${currencySymbol}${Math.abs(savings).toFixed(2)}.`,
            type: "negative",
        })
        }
    }

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]
    if (topCategory && topCategory[1] > 0 && expenses > 0) {
        const pct = (topCategory[1] / expenses) * 100
        if (pct > 15) {
        insights.push({
            text: `${topCategory[0]} is your biggest expense, representing ${pct.toFixed(0)}% of your spending this month.`,
            type: "info",
        })
        }
    }

    for (const [category, limit] of Object.entries(budgets)) {
        if (limit > 0) {
        const spent = categoryTotals[category] || 0
        const pctUsed = (spent / limit) * 100
        if (pctUsed >= 80 && pctUsed < 100 && daysLeft > 0) {
            insights.push({
            text: `Budget Warning - You've used ${pctUsed.toFixed(0)}% of your ${category} budget with ${daysLeft} days remaining.`,
            type: "warning",
            })
            break
        }
        if (pctUsed >= 100) {
            insights.push({
            text: `Budget Exceeded - You've gone over your ${category} budget by ${currencySymbol}${(spent - limit).toFixed(2)}.`,
            type: "negative",
            })
            break
        }
        }
    }

    const activeGoal = goals.find((goal) => goal.currentAmount < goal.targetAmount && goal.targetAmount > 0 && goal.targetDate)
    if (activeGoal) {
        const remaining = activeGoal.targetAmount - activeGoal.currentAmount
        const targetDate = new Date(activeGoal.targetDate!)
        const monthsLeft = Math.max(1, Math.round((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)))
        const requiredMonthly = remaining / monthsLeft

        if (requiredMonthly > 0) {
        insights.push({
            text: `To reach ${activeGoal.name} by ${targetDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}, you need to save ${currencySymbol}${requiredMonthly.toFixed(2)} per month.`,
            type: "info",
        })
        }
    }

    if (expenses > 0 && dayOfMonth > 0) {
      const dailyAvg = expenses / dayOfMonth
      const projectedTotal = dailyAvg * daysInMonth
      insights.push({
        text: `At your current rate, you are projected to spend ${currencySymbol}${projectedTotal.toFixed(2)} by the end of the month.`,
        type: "info",
      })
    }

    if (prevBalance !== 0 && balance !== 0) {
      const nwDiff = balance - prevBalance
      if (nwDiff !== 0) {
        const pct = (nwDiff / Math.abs(prevBalance)) * 100
        if (Math.abs(pct) > 1) {
          insights.push({
            text: `Net Worth Trend: Your net worth is ${nwDiff > 0 ? "up" : "down"} ${currencySymbol}${Math.abs(nwDiff).toFixed(2)} (${pct > 0 ? "+" : ""}${pct.toFixed(0)}%) compared to last month.`,
            type: nwDiff > 0 ? "positive" : "negative",
          })
        }
      }
    }

    if (assets.length > 0) {
      insights.push({
        text: `You are tracking ${assets.length} asset${assets.length > 1 ? "s" : ""} in your portfolio. Keep updating the prices to track your net worth accurately.`,
        type: "info",
      })
    }
  
  return insights
}
