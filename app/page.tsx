"use client"
// components
import { useState, useEffect } from "react"
import { TransactionList } from "@/components/recentTransactions/transactionList"
import { GoalCard } from "@/components/goalCard"
import { GoalDialog } from "@/components/add-goal-ui"
import { AddTransactionDialog } from "@/components/recentTransactions/add-transaction-ui"
import { CategoryBreakdown } from "@/components/categoryBreakdown"
import { SpendingChart } from "@/components/spendingCharts"
import { BudgetOverview } from "@/components/budgetOverview"
import { SettingsDialog } from "@/components/settingsUI"
import { EditTransactionDialog } from "@/components/recentTransactions/edit-transaction-ui"

// types
import type { Transaction } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { FilterPeriod } from "@/lib/calculations"

// libs
import { calculateIncome, calculateExpenses, filterTransactionsByPeriod } from "@/lib/calculations"
import { saveTransactions, saveGoal as saveGoalStorage, saveCategories, saveBudgets, saveCurrency, loadAllData } from "@/lib/localstorage"
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

  const [currency, setCurrency] = useState("USD")

  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("lifetime")

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  // load localstorage 
  useEffect(() => {
    const data = loadAllData()
    setTransactions(data.transactions)
    setCategories(data.categories)
    setBudgets(data.budgets)
    setCurrency(data.currency)
    if (data.goal) {
      setGoal(data.goal)
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

  useEffect(() => {
    if (isLoaded) {
      saveCurrency(currency)
    }
  }, [isLoaded, currency])


  const lifetimeIncome = calculateIncome(transactions)
  const lifetimeExpenses = calculateExpenses(transactions)
  const balance = lifetimeIncome - lifetimeExpenses
  const progress = goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0
  const remaining = goal ? goal.targetAmount - goal.currentAmount : 0
  const currencySymbol = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "CA$", AUD: "A$", CHF: "Fr", INR: "₹" }[currency] ?? "$"
  
  const now = new Date()
  const thisMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      return false
    }
    return (
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    )
  })
  const income = calculateIncome(thisMonthTransactions)
  const expenses = calculateExpenses(thisMonthTransactions)
  const filteredTransactions = filterTransactionsByPeriod(transactions, filterPeriod)
  const categoryTotals = getCategoryTotals(filteredTransactions)

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
      date: new Date().toISOString(),
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setDescription("")
    setAmount("")
    setCategory("")
    setTransactionType("expense")
    setOpen(false)
  }

  function deleteTransaction(id: number) {
    const transaction = transactions.find((transaction) => transaction.id === id)

    if (transaction && transaction.category === "Contribution to Savings Goal") {
      setGoal((prev) => {
        if (!prev) {
          return prev
        }
        return {
          ...prev, currentAmount: Math.max(0, prev.currentAmount - transaction.amount)
        }
      })
    }

    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  function editTransaction(id: number, description: string, amount: number, type : "income" | "expense", category: string) {
    setTransactions((prev) => 
      prev.map((transaction) =>
      transaction.id === id ? { ...transaction, description, amount, category, type }: transaction
    ))
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
    if (categoryToDelete === "Contribution to Savings Goal") {
      return
    }

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

  function contributeToGoal(amount: number) {
    if (!goal) {
      return
    }

    setGoal((prev) => {
      if (!prev) {
        return prev
      }
      return {
        ...prev, currentAmount: prev.currentAmount + amount
      }
    })

    setCategories((prev) => {
      if (prev.includes("Contribution to Savings Goal")) {
        return prev
      } else {
        return [...prev, "Contribution to Savings Goal"]
      }
    })

    const savingsTransaction: Transaction = {
      id: Date.now(),
      description: `Savings ${goal.name}`,
      amount,
      type: "expense",
      category: "Contribution to Savings Goal",
      date: new Date().toISOString(),
    }
    setTransactions((prev) => [savingsTransaction, ...prev])
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">DimeTrack</h1>
            <SettingsDialog categories={categories} newCategory={newCategory} setNewCategory={setNewCategory} onAddNewCategory={addCategory} onDeleteCategory={deleteCategory} currency={currency} onCurrencyChange={setCurrency} />
          </div>
        </header>

        {/* Current balance card */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Current Balance <span className="text-xs">(All Time)</span></p>
            <h2 className="mt-2 text-3xl font-bold">{currencySymbol}{balance.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Income this month</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">{currencySymbol}{income.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Expenses this month</p>
            <h2 className="mt-2 text-3xl font-bold text-red-600">{currencySymbol}{expenses.toFixed(2)}</h2>
          </div>
        </div>

        {/* Goal card */}
        <GoalCard goal={goal} progress={progress} remaining={remaining} onContribute={contributeToGoal} onEdit={() => setGoalDialogOpen(true)} currencySymbol={currencySymbol} />

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
            categories={categories.filter(category => category !== "Contribution to Savings Goal")}
            category={category}
            setCategory={setCategory}
            transactionType={transactionType}
            setTransactionType={setTransactionType}
            onSave={addTransaction}
          />
        </div>

        {/* Recent transactions card */}
        <div className="mt-6 rounded-2xl border p-6">
          <EditTransactionDialog 
            transaction={editingTransaction}
            open={!!editingTransaction} 
            onClose={() => setEditingTransaction(null)} 
            categories={categories.filter(category => category !== "Contribution to Savings Goal")}
            onSave={editTransaction} />
          <TransactionList 
            transactions={filteredTransactions} 
            onEditClick={setEditingTransaction} 
            onDelete={deleteTransaction} 
            currencySymbol={currencySymbol} 
            filter={filterPeriod} 
            onFilterChange={setFilterPeriod} />
        </div>
        {/* Breakdown into categories */}
        <CategoryBreakdown totals={categoryTotals} currencySymbol={currencySymbol} />
        {/* chart */}
        <SpendingChart totals={categoryTotals} />
        {/* budget */}
        <BudgetOverview totals={categoryTotals} budgets={budgets} onUpdateBudget={updateBudget} currencySymbol={currencySymbol} />
      </div>
    </main>
  )
}