import { Transaction } from "@/types/transaction"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import type { FilterPeriod } from "@/lib/calculations"

const filterLabels: Record<FilterPeriod, string> = {
    today: "Today",
    week: "This week",
    month: "This month",
    year: "This year",
    lifetime: "All time"
}

type Things = {
    transactions: Transaction[]
    onDelete(id: number): void
    onEditClick: (transaction: Transaction) => void
    currencySymbol: string
    filter: FilterPeriod
    onFilterChange: (filter: FilterPeriod) => void
}

export function TransactionList({
    transactions, onDelete, onEditClick, currencySymbol, filter, onFilterChange
}: Things) {
    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            {filterLabels[filter]} <span className="text-xs">▾</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {(Object.keys(filterLabels) as FilterPeriod[]).map((period) => (
                            <DropdownMenuItem
                                key={period}
                                className={filter === period ? "font-semibold" : ""}
                                onClick={() => onFilterChange(period)}>
                                {filterLabels[period]}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {transactions.length === 0 ? (
                <p className="text-muted-foreground">No transactions for this period</p>
            ) : (
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                            <div>
                                <p className="font-medium">{transaction.description}</p>

                                <div className="flex gap-2 text-sm text-muted-foreground">
                                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{transaction.category}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                    {transaction.type === "income" ? "+" : "-"}{currencySymbol}{transaction.amount.toFixed(2)}
                                </span>
                                {transaction.category !== "Contribution to Savings Goal" && (
                                    <Button variant="ghost" size="sm" onClick={() => onEditClick(transaction)}>✎</Button>
                                )}
                                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(transaction.id)}>✕</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}