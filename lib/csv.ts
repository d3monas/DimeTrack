import type { Transaction } from "@/types/transaction";

export function exportToCSV(transactions: Transaction[], filename="dimetrack-transactions.csv") {
    const headers = ["Date", "Description", "Category", "Type", "Amount"]
    const rows = transactions.map((transaction) => [
        new Date(transaction.date).toLocaleDateString(),
        escapeCSVField(transaction.description),
        escapeCSVField(transaction.category),
        transaction.type,
        transaction.amount.toFixed(2)
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"})
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

function escapeCSVField(field: string): string {
    if (field.includes(",") || field.includes('"') || field.includes("\n")) {
        return (
            `"${field.replace(/"/g, '""')}"`
        )
    }
    return field
}