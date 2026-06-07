import type { Transaction } from "../types/transaction"

export function calculateIncome(
    transactions: Transaction[]
) {
    return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function calculateExpenses(
    transactions: Transaction[]
) {
    return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}