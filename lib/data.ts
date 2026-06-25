import { Transaction } from "@/types/transaction"

type AppBackupThings = {
    transactions: Transaction[]
    goals: any[]
    categories: string[]
    budgets: Record<string, number>
    currency: string
    recurring: any[]
}

export function exportToJSON(data: AppBackupThings, filename = "dimetrack-backup.json") {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: "application/json/charset-utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

export function importFromJSON(file: File): Promise<AppBackupThings> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const parsed = JSON.parse(text)

                if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.categories)) {
                    return reject(new Error("Invalid backup file format"))
                }

                resolve(parsed as AppBackupThings)
            } catch (error) {
                reject(error)
            }
        }
        reader.onerror = reject
        reader.readAsText(file)
    })
}