import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Account } from "@/types/account"
import type { Rule } from "@/types/rule"
import type { categoryCustomization } from "@/lib/categoryCustomization"

export function getSampleData() {
  const now = new Date()
  const daysAgo = (days: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  const accounts: Account[] = [
    { id: "acc-1", name: "Checking", color: "#3b82f6", icon: "Wallet" },
    { id: "acc-2", name: "Savings", color: "#22c55e", icon: "PiggyBank" }
  ]

  const categories = ["Salary", "Rent", "Groceries", "Entertainment", "Transport", "Savings: Vacation"]
  
  const categoryCustomization: Record<string, categoryCustomization> = {
    "Salary": { color: "#22c55e", icon: "Briefcase" },
    "Rent": { color: "#ef4444", icon: "Home" },
    "Groceries": { color: "#f59e0b", icon: "ShoppingCart" },
    "Entertainment": { color: "#8b5cf6", icon: "Gamepad2" },
    "Transport": { color: "#06b6d4", icon: "Car" },
    "Savings: Vacation": { color: "#ec4899", icon: "Plane" }
  }

  const budgets: Record<string, number> = {
    "Rent": 1500,
    "Groceries": 400,
    "Entertainment": 150,
    "Transport": 200
  }

  const goals: Goal[] = [
    { id: "goal-1", name: "Vacation", currentAmount: 850, targetAmount: 2000, targetDate: new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString() }
  ]

  const recurring: RecurringTransaction[] = [
    { id: "rec-1", description: "Salary", amount: 3000, type: "income", category: "Salary", interval: "monthly", lastProcessedDate: daysAgo(5), createdAt: daysAgo(5), isActive: true },
    { id: "rec-2", description: "Rent", amount: 1500, type: "expense", category: "Rent", interval: "monthly", lastProcessedDate: daysAgo(5), createdAt: daysAgo(5), isActive: true },
    { id: "rec-3", description: "Netflix", amount: 15.99, type: "expense", category: "Entertainment", interval: "monthly", lastProcessedDate: daysAgo(5), createdAt: daysAgo(5), isActive: true }
  ]

  const transactions: Transaction[] = [
    { id: "tx-1", description: "Salary", amount: 3000, type: "income", category: "Salary", date: daysAgo(5), accountId: "acc-1" },
    { id: "tx-2", description: "Rent", amount: 1500, type: "expense", category: "Rent", date: daysAgo(5), accountId: "acc-1" },
    { id: "tx-3", description: "Target", amount: 85.20, type: "expense", category: "Groceries", date: daysAgo(4), accountId: "acc-1" },
    { id: "tx-4", description: "Uber", amount: 22.50, type: "expense", category: "Transport", date: daysAgo(4), accountId: "acc-1", tags: ["Work"] },
    { id: "tx-5", description: "Netflix", amount: 15.99, type: "expense", category: "Entertainment", date: daysAgo(3), accountId: "acc-1" },
    { id: "tx-6", description: "Savings towards Vacation", amount: 200, type: "expense", category: "Savings: Vacation", date: daysAgo(2), accountId: "acc-1" },
    { id: "tx-7", description: "Transfer to Savings", amount: 500, type: "transfer", category: "Transfer", date: daysAgo(2), accountId: "acc-1", transferAccountId: "acc-2" },
    { id: "tx-8", description: "Target", amount: 42.15, type: "expense", category: "Groceries", date: daysAgo(1), accountId: "acc-1" },
    { id: "tx-9", description: "Coffee", amount: 6.50, type: "expense", category: "Groceries", date: daysAgo(1), accountId: "acc-1" },
    { id: "tx-10", description: "Walmart", amount: 120.00, type: "expense", category: "Groceries", date: daysAgo(35), accountId: "acc-1" },
    { id: "tx-11", description: "Steam Game", amount: 29.99, type: "expense", category: "Entertainment", date: daysAgo(35), accountId: "acc-1" },
    { id: "tx-12", description: "Gas", amount: 45.00, type: "expense", category: "Transport", date: daysAgo(40), accountId: "acc-1" },
  ]

  const rules: Rule[] = [
    { id: "rule-1", contains: "Uber", category: "Transport" }
  ]

  return {
    transactions,
    goals,
    categories,
    budgets,
    currency: "USD",
    recurring,
    rules,
    categoryCustomization,
    accounts,
    defaultAccountId: "acc-1",
    accentColor: "",
    onboardingComplete: false
  }
}