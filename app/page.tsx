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

  useEffect(() => {
    const savedGoal = loadGoalStorage()

    if (savedGoal) {
      setGoal(savedGoal)

      setGoalName(savedGoal.name)
      setGoalSaved(savedGoal.currentAmount.toString())
      setGoalTarget(savedGoal.targetAmount.toString())
    }
  }, [])

  useEffect(() => {
    if (goal) {
      saveGoalStorage(goal)
    }
  }, [goal])

  const [goalName, setGoalName] = useState("")
  const [goalTarget, setGoalTarget] = useState("")
  const [goalSaved, setGoalSaved] = useState("")
  
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")

  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const savedCategories = loadCategories()

    if (savedCategories.length > 0) {
      setCategories(savedCategories)
    }
  }, [])

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    const saved = loadTransactions()

    if (saved.length > 0) {
      setTransactions(saved) 
    }
  }, [])

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const progress = goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0

  const income = calculateIncome(transactions)
  const expenses = calculateExpenses(transactions)

  const balance = income - expenses
  const categoryTotals = getCategoryTotals(transactions)

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

  function saveGoal() {
    const saved = Number(goalSaved)
    const target = Number(goalTarget)

    if (!goalName || Number.isNaN(saved) || Number.isNaN(target) || target <= 0 || saved < 0) {
      return
    }

    setGoal({
      name: goalName,
      currentAmount: saved,
      targetAmount: target
    })
    setGoalDialogOpen(false)
  }

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  function addCategory() {
    if (!newCategory) {
      return
    }

    if (categories.includes(newCategory.trim())) {
      return
    }

    setCategories((prev) => [...prev, newCategory.trim()])
    setNewCategory("")
    setCategoryDialogOpen(false)
  }

  const [open, setOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)

  const [budgets, setBudgets] = useState<Record<string, number>>({
    "Food": 50,
    "Subscriptions": 20,
    "Other": 30
    })

  useEffect(() => {
    const savedBudgets = loadBudgets()

    if (Object.keys(savedBudgets).length > 0) {
      setBudgets(savedBudgets)
    }
  }, [])

  useEffect(() => {
    saveBudgets(budgets)
  }, [budgets])
  
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">DimeTrack</h1>
          <p className="text-muted-foreground">Track spending and save for goals.</p>
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
        {goal ? (
          <GoalCard goal={goal} progress={progress} remaining={remaining} onEdit={() => setGoalDialogOpen(true)} />
        ):(
          <div className="mt-6 rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">No goal set</h2>
            <p className="text-muted-foreground mt-4">Create your goal now!</p>
          </div>
        )}

        {/* Edit goal button */}
        <GoalDialog open={goalDialogOpen} setOpen={setGoalDialogOpen} goalName={goalName} setGoalName={setGoalName} goalTarget={goalTarget} setGoalTarget={setGoalTarget} goalSaved={goalSaved} setGoalSaved={setGoalSaved} onSave={saveGoal} />

        {/* Add transaction button */}
        <div className="mt-6 flex justify-end">
          <AddTransactionDialog open={open} setOpen={setOpen} description={description} setDescription={setDescription} amount={amount} setAmount={setAmount} categories={categories} category={category} setCategory={setCategory} transactionType={transactionType} setTransactionType={setTransactionType} onSave={addTransaction}
          newCategory={newCategory} setNewCategory={setNewCategory} categoryDialogOpen={categoryDialogOpen} setCategoryDialogOpen={setCategoryDialogOpen} onAddCategory={addCategory} />
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
        <BudgetOverview totals={categoryTotals} budgets={budgets} />

      </div>
    </main>
  )
}