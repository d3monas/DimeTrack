"use client"
// components
import { useState, useEffect } from "react"
import { TransactionList } from "@/components/transactionList"
import { GoalCard } from "@/components/goalCard"
import { GoalDialog } from "@/components/add-goal-ui"
import { AddTransactionDialog } from "@/components/add-transaction-ui"
import { CategoryBreakdown } from "@/components/categoryBreakdown"
import { SpendingChart } from "@/components/spendingCharts"
import { BudgetOverview } from "@/components/budgetOverview"
import { SettingsDialog } from "@/components/settingsUI"

// types
import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"

// libs
import { calculateIncome, calculateExpenses } from "@/lib/calculations"
import { saveTransactions, loadTransactions, saveGoal as saveGoalStorage, loadGoal as loadGoalStorage, saveCategories, loadCategories, saveBudgets, loadBudgets } from "@/lib/localstorage"
import { getCategoryTotals } from "@/lib/categories"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goal, setGoal] = useState<Goal | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [budgets, setBudgets] = useState<Record<string, number>>({})

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")

  const [open, setOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  // load localstorage 
  useEffect(() => {
    setTransactions(loadTransactions())
    setCategories(loadCategories())
    setBudgets(loadBudgets())
    const savedGoal = loadGoalStorage()
    if (savedGoal) {
      setGoal(savedGoal)
    }
    setIsLoaded(true)
  }, [])

  // write to localstorage on data change
  useEffect(() => {
    if (!isLoaded) {
      return
    }
    if (goal) {
      saveGoalStorage(goal)
    } else {
      localStorage.removeItem('goal')
    }
  }, [isLoaded,goal])

  useEffect(() => {
    if (isLoaded) {
      saveTransactions(transactions)
    }
  }, [isLoaded,transactions])

  useEffect(() => {
    if (isLoaded) {
      saveCategories(categories)
    }
  }, [isLoaded,categories])

  useEffect(() => {
    if (isLoaded) {
      saveBudgets(budgets)
    }
  }, [isLoaded,budgets])

  useEffect(() => {
    if (!isLoaded) {
      return
    }
    setBudgets((prev) => {
      const updated = { ...prev }
      categories.forEach((category) => {
        if (!(category in updated)) {
          updated[category] = 0
        }
      })
      return updated
    })
  }, [categories])


  const income = calculateIncome(transactions)
  const expenses = calculateExpenses(transactions)
  const balance = income - expenses
  const categoryTotals = getCategoryTotals(transactions)
  const progress = goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0

  function addTransaction() {
    const numberCheck = Number(amount)

    if (!description || !amount || !category || Number.isNaN(numberCheck) || numberCheck <= 0) {
      return
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount: numberCheck,
      type: transactionType,
      category,
      date: new Date().toLocaleDateString(),
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setDescription("")
    setAmount("")
    setCategory("")
    setTransactionType("expense")
    setOpen(false)
  }

  function deleteTransaction(id: number) {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  function saveGoal(name: string, currentAmount: number, targetAmount: number) {
    setGoal({ name, currentAmount, targetAmount })
  }

  function addCategory() {
    if (!newCategory) {
      return
    }

    if (categories.includes(newCategory.trim())) {
      return
    }
    setCategories((prev) => [...prev, newCategory.trim()])
    setNewCategory("")
  }

  function deleteCategory(categoryToDelete: string) {
    setCategories((prev) =>
      prev.filter((category) => category !== categoryToDelete)
    )
    setBudgets((prev) => {
      const updated = { ...prev }
      delete updated[categoryToDelete]
      return updated
    })

    setTransactions(prev =>
      prev.map(transaction =>
        transaction.category === categoryToDelete ? { ...transaction, category: "Uncategorized" } : transaction
      )
    )
  }

  function updateBudget(category: string, limit: number) {
    setBudgets((prev) => ({...prev, [category]: limit}))
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">DimeTrack</h1>
            <SettingsDialog categories={categories} newCategory={newCategory} setNewCategory={setNewCategory} onAddNewCategory={addCategory} onDeleteCategory={deleteCategory} />
          </div>
        </header>

        {/* Current balance card */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <h2 className="mt-2 text-3xl font-bold">${balance.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Income this month</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">${income.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Expenses this month</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">${expenses.toFixed(2)}</h2>
          </div>
        </div>

        {/* Goal card */}
        <GoalCard goal={goal} progress={progress} remaining={remaining} onEdit={() => setGoalDialogOpen(true)} />

        {/* Edit goal button */}
        <GoalDialog open={goalDialogOpen} setOpen={setGoalDialogOpen} goal={goal} onSave={saveGoal} />

        {/* Add transaction button */}
        <div className="mt-6 flex justify-end">
          <AddTransactionDialog
            open={open}
            setOpen={setOpen}
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            categories={categories}
            category={category}
            setCategory={setCategory}
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            onSave={addTransaction}
          />
        </div>

        {/* Recent transactions card */}
        <div className="mt-6 rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>
        {/* Breakdown into categories */}
        <CategoryBreakdown totals={categoryTotals} />
        {/* chart */}
        <SpendingChart totals={categoryTotals} />
        {/* budget */}
        <BudgetOverview totals={categoryTotals} budgets={budgets} onUpdateBudget={updateBudget} />
      </div>
    </main>
  )
}