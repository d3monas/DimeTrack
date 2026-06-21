import { Button } from "@/components/ui/button"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { getNextDate } from "@/lib/recurring"

type RecurringManagerThings = {
    recurring: RecurringTransaction[]
    currencySymbol: string
    onDelete: (id: string) => void
}

function getIntervalLabel(recurring: RecurringTransaction): string {
    if (recurring.interval === "custom") {
        const value = recurring.customIntervalValue ?? 1
        const unit = recurring.customIntervalUnit ?? "days"
        return (
            `Every ${value} ${value === 1 ? unit.slice(0, -1) : unit}`
        )
    }
    const labels: Record<RecurringTransaction["interval"], string> = {
        daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly", custom: "Custom"
    }
    return labels[recurring.interval]
}

export function RecurringManager({ recurring, currencySymbol, onDelete }: RecurringManagerThings) {
    if (recurring.length === 0) {
        return (
            <div>
                <h3 className="font-semibold">Recurring Transactions</h3>
                <p className="text-sm text-muted-foreground">No recurring transactions yet. To add: check "Recurring transaction" when adding a transaction</p>
            </div>
        )
    }

    return (
        <div>
            <h3 className="font-semibold mb-2">Recurring Transactions</h3>

            <div className="space-y-2">
                {recurring.map((recurring) => (
                <div key={recurring.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                    <div className="min-w-0">
                        <p className="font-medium text-sm">{recurring.description}</p>
                        <p className="text-xs text-muted-foreground">Renews: {getIntervalLabel(recurring)}</p>
                        <p className="text-xs text-muted-foreground">Created on {new Date(recurring.createdAt).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Next renewal at {getNextDate(recurring).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-medium ${recurring.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {recurring.type === "income" ? "+" : "-"}{currencySymbol}{recurring.amount.toFixed(2)}
                        </span>
                        <Button variant="destructive" size="sm" onClick={() => onDelete(recurring.id)}>Delete</Button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}