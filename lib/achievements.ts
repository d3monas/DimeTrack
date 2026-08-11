import { Asset } from "@/types/asset"
import { Goal } from "@/types/goal"
import { Transaction } from "@/types/transaction"
import { INVESTMENT_CATEGORY } from "./consts"

export type Achievement = {
    id: string
    title: string
    description: string
    icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first_transaction", title: "First Steps", description: "Log your first transaction", icon: "Footprints" },
    { id: "50_transactions", title: "Getting Serious", description: "Log 50 transactions", icon: "ListChecks" },
    { id: "100_transactions", title: "Data Hoarder", description: "Log 100 transactions", icon: "Database" },
    { id: "first_goal", title: "Dream Big", description: "Create your first savings goal", icon: "Target" },
    { id: "first_goal_completed", title: "Goal Getter", description: "Fully fund a savings goal", icon: "Trophy" },
    { id: "first_investment", title: "Wall Street", description: "Log your first investment", icon: "LineChart" },
    { id: "saved_1000", title: "First 1000", description: "Save 1,000 total", icon: "PiggyBank" },
    { id: "tracked_7_days", title: "Week One", description: "Track your finances for 7 days", icon: "CalendarDays" },
]

export function checkAchievements(transactions: Transaction[], goals: Goal[], assets: Asset[]): string[] {
    const unlocked = new Set<string>()

    if (transactions.length > 0) {
        unlocked.add("first_transaction")
    }
    if (transactions.length >= 50) {
        unlocked.add("50_transactions")
    }
    if (transactions.length >= 100) {
        unlocked.add("100_transactions")
    }

    if (goals.length > 0) {
        unlocked.add("first_goal")
    }
    if (goals.some(goal => goal.currentAmount >= goal.targetAmount && goal.targetAmount > 0)) {
        unlocked.add("first_goal_completed")
    }

    if (assets.length > 0 || transactions.some(transaction => transaction.category === INVESTMENT_CATEGORY)) {
        unlocked.add("first_investment")
    }

    const totalSaved = transactions
        .filter(transaction => transaction.type === "expense" && transaction.type.startsWith("Savings: "))
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    
    if (totalSaved >= 1000) {
        unlocked.add("saved_1000")
    }

    if (transactions.length > 0) {
        const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        const firstDate = new Date(sorted[0].date).getTime()
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000
        if (Date.now() - firstDate >= sevenDaysInMs) {
            unlocked.add("tracked_7_days")
        }
    }

    return Array.from(unlocked)
}