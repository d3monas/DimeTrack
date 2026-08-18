import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { Asset } from "@/types/asset"
import { INVESTMENT_CATEGORY } from "@/lib/consts"

export type Achievement = {
    id: string
    title: string
    description: string
    icon: string
    goalValue: number
}

export const ACHIEVEMENTS: Achievement[] = [
    { id: "first_transaction", title: "First Steps", description: "Log your first transaction", icon: "Footprints", goalValue: 1 },
    { id: "50_transactions", title: "Getting Serious", description: "Log 50 transactions", icon: "ListChecks", goalValue: 50 },
    { id: "100_transactions", title: "Data Hoarder", description: "Log 100 transactions", icon: "Database", goalValue: 100 },
    { id: "500_transactions", title: "Transaction Master", description: "Log 500 transactions", icon: "BookMarked", goalValue: 500 },
    { id: "first_goal", title: "Dream Big", description: "Create your first savings goal", icon: "Target", goalValue: 1 },
    { id: "first_goal_completed", title: "Goal Getter", description: "Fully fund a savings goal", icon: "Trophy", goalValue: 1 },
    { id: "first_investment", title: "Wall Street", description: "Log your first investment", icon: "LineChart", goalValue: 1 },
    { id: "saved_1000", title: "First 1000", description: "Save 1,000 total", icon: "PiggyBank", goalValue: 1000 },
    { id: "saved_5000", title: "5000 Already", description: "Save 5,000 total", icon: "Gem", goalValue: 5000 },
    { id: "tracked_7_days", title: "Week One", description: "Track your finances for 7 days", icon: "CalendarDays", goalValue: 7 },
    { id: "tracked_30_days", title: "Monthly Habit", description: "Track your finances for 30 days", icon: "CalendarRange", goalValue: 30 },
    { id: "tracked_100_days", title: "Centurion", description: "Track your finances for 100 days", icon: "CalendarClock", goalValue: 100 },
]

export type CheckedAchievement = {
    id: string
    currentValue: number
    unlocked: boolean
}

export function checkAchievements(transactions: Transaction[], goals: Goal[], assets: Asset[], appInstallDate: string): Record<string, CheckedAchievement> {
    const evaluated: Record<string, CheckedAchievement> = {}

    evaluated["first_transaction"] = { id: "first_transaction", currentValue: transactions.length, unlocked: transactions.length >= 1 }
    evaluated["50_transactions"] = { id: "50_transactions", currentValue: transactions.length, unlocked: transactions.length >= 50 }
    evaluated["100_transactions"] = { id: "100_transactions", currentValue: transactions.length, unlocked: transactions.length >= 100 }
    evaluated["500_transactions"] = { id: "500_transactions", currentValue: transactions.length, unlocked: transactions.length >= 500 }

    evaluated["first_goal"] = { id: "first_goal", currentValue: goals.length, unlocked: goals.length >= 1 }
    const completedGoals = goals.filter(g => g.targetAmount > 0 && g.currentAmount >= g.targetAmount).length
    evaluated["first_goal_completed"] = { id: "first_goal_completed", currentValue: completedGoals, unlocked: completedGoals >= 1 }

    const investmentTransactionCount = transactions.filter(t => t.category === INVESTMENT_CATEGORY).length
    const hasInvestments = assets.length > 0 || investmentTransactionCount > 0
    evaluated["first_investment"] = { id: "first_investment", currentValue: hasInvestments ? 1 : 0, unlocked: hasInvestments }

    const totalSaved = transactions
        .filter(t => t.type === "expense" && t.category.startsWith("Savings: "))
        .reduce((sum, t) => sum + t.amount, 0)
    evaluated["saved_1000"] = { id: "saved_1000", currentValue: totalSaved, unlocked: totalSaved >= 1000 }
    evaluated["saved_5000"] = { id: "saved_5000", currentValue: totalSaved, unlocked: totalSaved >= 5000 }

    let daysTracked = 0
    if (appInstallDate) {
        const installTime = new Date(appInstallDate).getTime()
        daysTracked = Math.floor((Date.now() - installTime) / (1000 * 60 * 60 * 24))
    }

    evaluated["tracked_7_days"] = { id: "tracked_7_days", currentValue: daysTracked, unlocked: daysTracked >= 7 }
    evaluated["tracked_30_days"] = { id: "tracked_30_days", currentValue: daysTracked, unlocked: daysTracked >= 30 }
    evaluated["tracked_100_days"] = { id: "tracked_100_days", currentValue: daysTracked, unlocked: daysTracked >= 100 }

    return evaluated
}