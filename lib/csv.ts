import type { Transaction } from "@/types/transaction";

export function exportToCSV(transactions: Transaction[], filename="dimetrack-transactions.csv") {
    const headers = ["Date", "Description", "Category", "Type", "Amount", "Notes"]
    const rows = transactions.map((transaction) => {
        let categoryString = transaction.category
        if (transaction.splits && transaction.splits.length > 0) {
            const splitString = transaction.splits.map(split => `${split.category} (${split.amount.toFixed(2)})`).join(", ")
            categoryString = `Split: ${splitString}`
        }

        return [
            new Date(transaction.date).toLocaleDateString(),
            escapeCSVField(transaction.description),
            escapeCSVField(categoryString),
            transaction.type,
            transaction.amount.toFixed(2),
            escapeCSVField(transaction.notes ?? "")
        ]
    })

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
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"'
                i++
            } else {
                inQuotes = !inQuotes
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current)
            current = ""
        } else {
            current += char
        }
    }
    result.push(current)
    return result
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
                    if (!lines[i]) {
                        continue
                    }

                    const values = parseCSVLine(lines[i])
                    if (!values || values.length < 5) {
                        continue
                    }

                    const cleanValues = values.map(value => value.replace(/^"|"$/g, "").replace(/""/g, '"'))

                    const dateStr = cleanValues[0]
                    const date = new Date(dateStr)

                    if (isNaN(date.getTime())) {
                        continue
                    }
                    
                    const notesValue = cleanValues[5] ? cleanValues[5] : undefined

                    transactions.push({
                        id: crypto.randomUUID(),
                        date: date.toISOString(),
                        description: cleanValues[1],
                        category: cleanValues[2],
                        type: cleanValues[3] as "income" | "expense",
                        amount: parseFloat(cleanValues[4]) || 0,
                        notes: notesValue
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