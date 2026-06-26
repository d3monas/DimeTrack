import { getNextDate } from "@/lib/recurring"
import { RecurringTransaction } from "@/types/recurringTransaction"
import { EmptyState } from "./emptyState"

type UpcomingTransactionsThings = {
    recurring: RecurringTransaction[]
    currencySymbol: string
}

export function UpcomingTransactions({ recurring, currencySymbol }: UpcomingTransactionsThings) {
    const now = new Date()
    const sevenDaysFromNow = new Date(now)
    now.setHours(0, 0, 0, 0)
    sevenDaysFromNow.setDate(now.getDate() + 7)

    const upcoming = recurring.map((recurring) => {
        const nextDate = getNextDate(recurring)
        nextDate.setHours(0, 0, 0, 0)
        const timeDiff = nextDate.getTime() - now.getTime()
        const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24))
        return {
            ...recurring, nextDate, daysDiff
        }
    })
    .filter((recurring) => recurring.daysDiff >= 0 && recurring.daysDiff <= 7)
    .sort((a, b) => a.daysDiff - b.daysDiff)

    if (upcoming.length === 0) {
        return (
            <div className="rounded-2xl border mt-6 p-4 sm:p-6">
                <h2>Upcoming transactions</h2>
                <EmptyState message="No recurring transactions due in the next 7 days" />
            </div>
        )
    }

    return (
        <div className="rounded-2xl border mt-6 p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold">Upcoming transactions</h2>

            <div className="space-y-3">
                {upcoming.map((recurring) => (
                    <div key={recurring.id} className="flex items-center justify-between gap-2 border-b pb-2 last:border-0 last:pb-0">
                        <div className="min-w-0">
                            <p className="font-medium text-sm">{recurring.description}</p>
                            <p className="text-xs text-muted-foreground">
                                {recurring.daysDiff === 0 ? "Due today" : `Due in ${recurring.daysDiff} day${recurring.daysDiff > 1 ? "s" : ""}`}
                            </p>
                        </div>
                        <span className={`text-sm font-medium ${recurring.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {recurring.type === "income" ? "+" : "-"}{currencySymbol}{recurring.amount.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}