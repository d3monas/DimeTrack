import { useState } from "react"
import { Transaction } from "@/types/transaction"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import type { FilterPeriod } from "@/lib/calculations"
import { isSavingsCategory } from "@/lib/consts"
import { PaginationUI } from "../paginationUI"
import { pagination } from "@/lib/pagination"
import { Input } from "../ui/input"
import { exportToCSV } from "@/lib/csv"
import { EmptyState } from "../emptyState"
import { SelectContent, SelectItem, SelectTrigger, Select, SelectValue } from "../ui/select"

const filterLabels: Record<FilterPeriod, string> = {
    today: "Today",
    week: "This week",
    month: "This month",
    year: "This year",
    lifetime: "All time"
}

const transactionsPerPage = 8

type Things = {
    transactions: Transaction[]
    onDelete(id: string): void
    onEditClick: (transaction: Transaction) => void
    currencySymbol: string
    filter: FilterPeriod
    onFilterChange: (filter: FilterPeriod) => void
    categories: string[]
}

export function TransactionList({
    transactions, onDelete, onEditClick, currencySymbol, filter, onFilterChange, categories
}: Things) {
    const [searchTerm, setSearchTerm] = useState("")

    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")

    const searchedTransactions = transactions.filter((transaction) => {
        if (!searchTerm.trim()) {
            return true
        }
        const query = searchTerm.toLowerCase()
        return (
            transaction.description.toLowerCase().includes(query) ||
            transaction.category.toLowerCase().includes(query) ||
            transaction.amount.toFixed(2).includes(query)
        )
    })

    const filteredTransactions = searchedTransactions.filter((transaction) => {
        const matchesType = typeFilter === "all" || transaction.type == typeFilter
        const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
        return (
            matchesType && matchesCategory
        )
    })

    function handleExport() {
        exportToCSV(filteredTransactions)
    }

    const { pageItems, currentPage, totalPages, nextPage, prevPage } = pagination(filteredTransactions, transactionsPerPage, `${searchTerm}-${typeFilter}-${categoryFilter}-${filter}`)
    return (
        <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <div className="flex flex-wrap items-center gap-2">
                    <Input
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 w-full text-sm sm:w-40"
                    />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-8 w-full text-sm sm:w-28">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="h-8 w-full text-sm sm:w-40">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport}>Export CSV</Button>
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
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <EmptyState message={searchTerm.trim() || typeFilter !== "all" || categoryFilter !== "all" ? `No transactions match your filters` : "No transactions for this period"} />
            ) : (
                <>
                    <div className="space-y-4">
                            {pageItems.map((transaction) => (
                                <div key={transaction.id} className="flex flex-wrap gap-2 items-center justify-between border-b pb-3 last:border-0">
                                    <div className="min-w-0">
                                        <p className="font-medium">{transaction.description}</p>

                                        {transaction.notes && (
                                            <p className="text-xs italic text-muted-foreground/80 mt-0.5">{transaction.notes}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            <span>{new Date(transaction.date).toLocaleString()}</span>
                                            <span>•</span>
                                            <span>
                                                {transaction.splits && transaction.splits.length > 0 
                                                    ? transaction.splits.map(split => `${split.category} - ${currencySymbol}${split.amount.toFixed(2)}`).join(", ")
                                                    : transaction.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                            {transaction.type === "income" ? "+" : "-"}{currencySymbol}{transaction.amount.toFixed(2)}
                                        </span>
                                        {!isSavingsCategory(transaction.category) ? (
                                            <Button variant="ghost" size="sm" onClick={() => onEditClick(transaction)}>✎</Button>
                                        ) : (
                                            <span className="w-8" />
                                        )}
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(transaction.id)}>✕</Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <PaginationUI currentPage={currentPage} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />
                </>
            )}
        </div>
    )
}