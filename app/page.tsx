"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// types
import type { Transaction } from "@/types/transaction"

// libs
import { calculateIncome, calculateExpenses } from "@/lib/calculations"

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

  const goal = {
    name: "IPhone 17",
    currentAmount: 420,
    targetAmount: 999.99,
  }
  
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions")

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
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

    setTransactions([newTransaction, ...transactions])
    setDescription("")
    setAmount("")
    setTransactionType("expense")
    setOpen(false)
  }

  function deleteTransaction(id: number) {
    setTransactions(transactions.filter((transaction) => transaction.id !== id))
  }

  const [open, setOpen] = useState(false)
  
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
        <div className="mt-6 rounded-2xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{goal.name}</h2>
              <p className="text-muted-foreground">Savings Goal</p>
            </div>

            <p className="font-bold">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-muted-foreground">${remaining.toFixed(2)} remaining</p>
        </div>

      {/* Recent transactions card */}
        <div className="mt-6 flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Transaction</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Coffee" />
                </div>

                <div>
                  <Label>Type</Label>

                  <Select value={transactionType} onValueChange={(value) => setTransactionType(value as "expense" | "income")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <div>
                  <Label>Amount</Label>
                  <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5" />
                </div>

                <Button className="w-full" onClick={addTransaction}>Save Transaction</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 rounded-2xl border p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>

                <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  <Button variant="ghost" size="sm" onClick={() => deleteTransaction(transaction.id)}>X</Button>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}