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

function parseCSVLine(line: string): string[] {
    const fields: string[] = []
    let current = ""
    let inQuote = false
    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (inQuote) {
            if (char === '"') {
                if (line[i + 1] === '"') {
                    current += '"'
                    i++
                } else {
                    inQuote = false
                }
            } else {
                current += char
            }
            continue
        }
        if (char === '"') {
            inQuote = true
        } else if (char === ",") {
            fields.push(current)
            current = ""
        } else {
            current += char
        }
    }
    fields.push(current)
    return fields
}

export function importFromCSV(file: File): Promise<Transaction[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const lines = text.split(/\r?\n/)
                if (lines.length < 2) {
                    return resolve([])
                }

                const transactions: Transaction[] = []

                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) {
                        continue
                    }

                    const values = parseCSVLine(lines[i])
                    if (values.length < 5) {
                        continue
                    }

                    const [dateString, description, category, typeString, amountString] = values
                    const date = new Date(dateString)

                    if (isNaN(date.getTime())) {
                        continue
                    }
                    
                    const type = typeString.trim().toLowerCase()
                    if (type !== "income" && type !== "expense") {
                        continue
                    }

                    const amount = parseFloat(amountString)
                    if (Number.isNaN(amount) || amount <= 0) {
                        continue
                    }

                    if (!description.trim() || !category.trim()) {
                        continue
                    }

                    transactions.push({
                        id: crypto.randomUUID(),
                        date: date.toISOString(),
                        description: description.trim(),
                        category: category.trim(),
                        type,
                        amount,
                    });
                }

                resolve(transactions)
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = reject
        reader.readAsText(file)
    })
}