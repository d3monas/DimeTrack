import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Account } from "@/types/account"
import type { Rule } from "@/types/rule"
import type { categoryCustomization } from "@/lib/categoryCustomization"
import { Asset } from "@/types/asset"

export function getSampleData() {
  const now = new Date()
  const thisMonthDay = (day: number) => {
    return (
      new Date(now.getFullYear(), now.getMonth(), day).toISOString()
    )
  }

  const lastMonthDay = (day: number) => {
    return (
      new Date(now.getFullYear(), now.getMonth() - 1, day).toISOString()
    )
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
    { id: "rec-1", description: "Salary", amount: 3000, type: "income", category: "Salary", interval: "monthly", lastProcessedDate: thisMonthDay(1), createdAt: thisMonthDay(1), isActive: true },
    { id: "rec-2", description: "Rent", amount: 1500, type: "expense", category: "Rent", interval: "monthly", lastProcessedDate: thisMonthDay(1), createdAt: thisMonthDay(1), isActive: true },
    { id: "rec-3", description: "Netflix", amount: 15.99, type: "expense", category: "Entertainment", interval: "monthly", lastProcessedDate: thisMonthDay(1), createdAt: thisMonthDay(1), isActive: true }
  ]

  const transactions: Transaction[] = [
    { id: "tx-1", description: "Salary", amount: 3000, type: "income", category: "Salary", date: thisMonthDay(1), accountId: "acc-1" },
    { id: "tx-2", description: "Rent", amount: 1500, type: "expense", category: "Rent", date: thisMonthDay(2), accountId: "acc-1" },
    { id: "tx-3", description: "Target", amount: 85.20, type: "expense", category: "Groceries", date: thisMonthDay(3), accountId: "acc-1" },
    { id: "tx-4", description: "Uber", amount: 22.50, type: "expense", category: "Transport", date: thisMonthDay(4), accountId: "acc-1", tags: ["Work"] },
    { id: "tx-5", description: "Netflix", amount: 15.99, type: "expense", category: "Entertainment", date: thisMonthDay(5), accountId: "acc-1" },
    { id: "tx-6", description: "Savings towards Vacation", amount: 200, type: "expense", category: "Savings: Vacation", date: thisMonthDay(6), accountId: "acc-1" },
    { id: "tx-7", description: "Transfer to Savings", amount: 500, type: "transfer", category: "Transfer", date: thisMonthDay(6), accountId: "acc-1", transferAccountId: "acc-2" },
    { id: "tx-10", description: "Walmart", amount: 120.00, type: "expense", category: "Groceries", date: lastMonthDay(10), accountId: "acc-1" },
    { id: "tx-11", description: "Steam Game", amount: 29.99, type: "expense", category: "Entertainment", date: lastMonthDay(12), accountId: "acc-1" },
    { id: "tx-12", description: "Gas", amount: 45.00, type: "expense", category: "Transport", date: lastMonthDay(15), accountId: "acc-1" },
  ]

  const rules: Rule[] = [
    { id: "rule-1", contains: "Uber", category: "Transport" }
  ]

  const assets: Asset[] = [
    { id: crypto.randomUUID(), name: "Apple Inc.", ticker: "APPL", type: "Stock", notes: "Long term hold", transactions: [
      { id: crypto.randomUUID(), type: "buy", date: new Date(Date.now() - 86400000 * 30).toISOString(), quantity: 5, pricePerUnit: 294.35},
      { id: crypto.randomUUID(), type: "update", date: new Date().toISOString(), quantity: 0, pricePerUnit: 305.93}
    ]}
  ]

  return {
    transactions,
    goals,
    categories,
    budgets,
    currency: "USD",
    recurring,
    rules,
    assets,
    categoryCustomization,
    accounts,
    defaultAccountId: "acc-1",
    accentColor: "",
    onboardingComplete: false
  }
}