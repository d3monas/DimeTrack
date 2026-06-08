import { Transaction } from "@/types/transaction"

export function saveTransactions(transactions: Transaction[]) {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

export function saveGoal(goal: any) {
    localStorage.setItem("goal", JSON.stringify(goal))
}

export function loadTransactions(): Transaction[] {
    const saved = localStorage.getItem("transactions")

    if (!saved) {
        return []
    }

    return JSON.parse(saved)
}

export function loadGoal(): any {
    const saved = localStorage.getItem("goal")

    if (!saved) {
        return []
    }

    return JSON.parse(saved)
}