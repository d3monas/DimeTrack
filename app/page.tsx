import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Transaction = {
  id: number,
  description: string,
  amount: number,
  type: "income" | "expense",
  date: string
}

export default function Home() {

  const transactions: Transaction[] = [
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
  ]

  const goal = {
    name: "IPhone 17",
    currentAmount: 420,
    targetAmount: 999.99,
  }

  const progress = (goal.currentAmount / goal.targetAmount) * 100
  const remaining = goal.targetAmount - goal.currentAmount

  const income = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((sum, transaction) => sum + transaction.amount, 0)

  const expenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((sum, transaction) => sum + transaction.amount, 0)

  const balance = income - expenses

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">PennyPath</h1>
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
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}