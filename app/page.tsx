"use client"
// components
import { useState, useEffect } from "react"
import { TransactionList } from "@/components/transactionList"
import { GoalCard } from "@/components/goalCard"
import { GoalDialog } from "@/components/add-goal-ui"
import { AddTransactionDialog } from "@/components/add-transaction-ui"

// types
import type { Transaction } from "@/types/transaction"

// libs
import { calculateIncome, calculateExpenses } from "@/lib/calculations"
import { saveTransactions, loadTransactions, saveGoal as saveGoalStorage, loadGoal as loadGoalStorage } from "@/lib/localstorage"

export default function Home() {

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      description: "Birthday Money",
      amount: 50,
      type: "income",
      date: "May 1, 2026",
    },
    {
      id: 2,
      description: "Spotify",
      amount: 11,
      type: "expense",
      date: "May 15, 2026",
    },
    {
      id: 3,
      description: "Breakfast",
      amount: 5,
      type: "expense",
      date: "May 20, 2026",
    },
  ])

  const [goal, setGoal] = useState({
    name: "IPhone 17",
    currentAmount: 420,
    targetAmount: 999.99,
  })

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
    saveGoalStorage(goal)
  }, [goal])

  const [goalName, setGoalName] = useState(goal.name)
  const [goalTarget, setGoalTarget] = useState(goal.targetAmount.toString())
  const [goalSaved, setGoalSaved] = useState(goal.currentAmount.toString())
  
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")

  useEffect(() => {
    const saved = loadTransactions()

    if (saved.length > 0) {
      setTransactions(saved) 
    }
  }, [])

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount

  const income = calculateIncome(transactions)
  const expenses = calculateExpenses(transactions)

  const balance = income - expenses

  function addTransaction() {
    const numberCheck = Number(amount)

    if (!description || !amount || Number.isNaN(numberCheck) || numberCheck <= 0) {
      return
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      description,
      amount: numberCheck,
      type: transactionType,
      date: new Date().toLocaleDateString(),
    }

    setTransactions((prev) => [newTransaction, ...prev])
    setDescription("")
    setAmount("")
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

  const [open, setOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)
  
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
        <GoalCard goal={goal} progress={progress} remaining={remaining} onEdit={() => setGoalDialogOpen(true)} />

        {/* Edit goal button */}
        <GoalDialog open={goalDialogOpen} setOpen={setGoalDialogOpen} goalName={goalName} setGoalName={setGoalName} goalTarget={goalTarget} setGoalTarget={setGoalTarget} goalSaved={goalSaved} setGoalSaved={setGoalSaved} onSave={saveGoal} />

        {/* Add transaction button */}
        <div className="mt-6 flex justify-end">
          <AddTransactionDialog open={open} setOpen={setOpen} description={description} setDescription={setDescription} amount={amount} setAmount={setAmount} transactionType={transactionType} setTransactionType={setTransactionType} onSave={addTransaction}></AddTransactionDialog>
        </div>

      {/* Recent transactions card */}
        <div className="mt-6 rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>

      </div>
    </main>
  )
}