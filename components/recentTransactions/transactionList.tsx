import { useEffect, useMemo, useState } from "react"
import { Transaction } from "@/types/transaction"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import type { FilterPeriod } from "@/lib/calculations/calculations"
import { isSavingsCategory } from "@/lib/consts"
import { PaginationUI } from "../paginationUI"
import { pagination } from "@/lib/pagination"
import { Input } from "../ui/input"
import { exportToCSV } from "@/lib/csv"
import { EmptyState } from "../emptyState"
import { SelectContent, SelectItem, SelectTrigger, Select, SelectValue } from "../ui/select"
import type { Account } from "@/types/account"
import { STARTING_BALANCE_CATEGORY, DEFAULT_CATEGORY_COLOR } from "@/lib/consts"
import { Copy } from "lucide-react"
import { Checkbox } from "../ui/checkbox"

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
    onDuplicate: (id: string) => void
    onBulkDelete: (ids: string[]) => void
    onBulkCategorize: (ids: string[], category: string) => void
    currencySymbol: string
    filter: FilterPeriod
    onFilterChange: (filter: FilterPeriod) => void
    categories: string[]
    accounts: Account[]
    onAddTransaction: () => void
    categoryCustomization: Record<string, { color: string, icon: string }>
}

export function TransactionList({
    transactions, onDelete, onEditClick, onDuplicate, onBulkDelete, onBulkCategorize, currencySymbol, filter, onFilterChange, categories, accounts, onAddTransaction, categoryCustomization
}: Things) {
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
    const [categoryFilter, setCategoryFilter] = useState<string>("all")

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

    const [tagFilter, setTagFilter] = useState<string>("all")
    const [sortOrder, setSortOrder] = useState<string>("date-desc")

    const isFiltered = searchTerm !== "" || typeFilter !== "all" || categoryFilter !== "all" || tagFilter !== "all" || sortOrder !== "date-desc"

    function resetFilters() {
        setSearchTerm("")
        setTypeFilter("all")
        setCategoryFilter("all")
        setTagFilter("all")
        setSortOrder("date-desc")
    }

    const allTags = useMemo(() => {
        const tagsSet = new Set<string>()
        transactions.forEach(transaction => {
            if (transaction.tags && transaction.tags.length > 0) {
                transaction.tags.forEach(tag => tagsSet.add(tag))
            }
        })
        return Array.from(tagsSet).sort()
    }, [transactions])

    const getAccountName = (id?: string) => {
        if (!id) {
            return null
        }
        return (
            accounts.find(account => account.id === id)?.name
        )
    }

    const visibleTransactions = transactions.filter(transaction => transaction.category !== STARTING_BALANCE_CATEGORY)
    const searchedTransactions = visibleTransactions.filter((transaction) => {
        if (!searchTerm.trim()) {
            return true
        }
        const query = searchTerm.toLowerCase()
        const tagsString = transaction.tags?.join(" ").toLowerCase() || ""
        return (
            transaction.description.toLowerCase().includes(query) ||
            transaction.category.toLowerCase().includes(query) ||
            transaction.amount.toFixed(2).includes(query) ||
            tagsString.includes(query)
        )
    })

    const filteredTransactions = searchedTransactions.filter((transaction) => {
        const matchesType = typeFilter === "all" || transaction.type === typeFilter
        const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
        const matchesTag = tagFilter === "all" || (transaction.tags && transaction.tags.includes(tagFilter))
        return (
            matchesType && matchesCategory && matchesTag
        )
    })

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        if (sortOrder === "date-desc") {
            return new Date(b.date).getTime() - new Date(a.date).getTime()
        }
        if (sortOrder === "date-asc") {
            return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
        if (sortOrder === "amount-desc") {
            return b.amount - a.amount
        }
        if (sortOrder === "amount-asc") {
            return a.amount - b.amount
        }
        return 0
    })

    function handleExport() {
        exportToCSV(sortedTransactions, accounts)
    }

    useEffect(() => {
        setSelectedIds(new Set())
    }, [searchTerm, typeFilter, categoryFilter, tagFilter, sortOrder, filter])

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const toggleSelectAll = () => {
        setSelectedIds(prev => {
            if (prev.size === sortedTransactions.length) {
                return new Set()
            }
            return new Set(sortedTransactions.map(t => t.id))
        })
    }

    const { pageItems, currentPage, totalPages, nextPage, prevPage } = pagination(sortedTransactions, transactionsPerPage, `${searchTerm}-${typeFilter}-${categoryFilter}-${tagFilter}-${sortOrder}-${filter}`)
    return (
        <div>
            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport} className="h-9">Export CSV</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-1 h-9">
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

                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={sortedTransactions.length > 0 && selectedIds.size === sortedTransactions.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                    />

                    <Input
                        placeholder="Search description, amount, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8 w-full text-sm"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="h-9 w-auto min-w-30 text-sm">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date-desc">Date (Newest)</SelectItem>
                            <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                            <SelectItem value="amount-desc">Amount (Highest)</SelectItem>
                            <SelectItem value="amount-asc">Amount (Lowest)</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="h-9 w-auto min-w-25 text-sm">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="h-9 w-auto min-w-32.5 text-sm">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {allTags.length > 0 && (
                        <Select value={tagFilter} onValueChange={setTagFilter}>
                            <SelectTrigger className="h-9 w-auto min-w-27.5 text-sm">
                                <SelectValue placeholder="Tag" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tags</SelectItem>
                                {allTags.map((tag) => (
                                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {isFiltered && (
                        <Button variant="ghost" size="sm" className="h-9 text-xs text-muted-foreground hover:text-foreground" onClick={resetFilters}>Clear Filters</Button>
                    )}
                </div>
            </div>

            {sortedTransactions.length === 0 ? (
                <EmptyState
                    message={searchTerm.trim() || typeFilter !== "all" || categoryFilter !== "all" || tagFilter !== "all" ? `No transactions match your filters` : "No transactions for this period"}
                    actionLabel={searchTerm.trim() || typeFilter !== "all" || categoryFilter !== "all" || tagFilter !== "all" ? undefined : "Add Transaction"}
                    onAction={searchTerm.trim() || typeFilter !== "all" || categoryFilter !== "all" || tagFilter !== "all" ? undefined : onAddTransaction}
                />
            ) : (
                <>
                    <div className="space-y-4">
                        {pageItems.map((transaction) => {
                            const fromAccount = getAccountName(transaction.accountId)
                            const toAccount = getAccountName(transaction.transferAccountId)
                            const isTransfer = transaction.type === "transfer"

                            return (
                                <div key={transaction.id} className="flex flex-wrap gap-2 items-center justify-between border-b pb-3 last:border-0">
                                    <div className="min-w-0 flex items-center gap-3">
                                        <Checkbox 
                                            checked={selectedIds.has(transaction.id)} 
                                            onCheckedChange={() => toggleSelection(transaction.id)} 
                                            aria-label="Select transaction"
                                        />
                                        <p className="font-medium">{transaction.description}</p>

                                        {transaction.notes && (
                                            <p className="text-xs italic text-muted-foreground/80 mt-0.5">{transaction.notes}</p>
                                        )}

                                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                            <span>{new Date(transaction.date).toLocaleString()}</span>
                                            {!isTransfer && (
                                                <>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <span
                                                            className="h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: categoryCustomization?.[transaction.category]?.color || DEFAULT_CATEGORY_COLOR }}
                                                        />
                                                        <span>
                                                            {transaction.splits && transaction.splits.length > 0
                                                                ? transaction.splits.map(split => `${split.category} - ${currencySymbol}${split.amount.toFixed(2)}`).join(", ")
                                                                : transaction.category}
                                                        </span>
                                                    </span>
                                                </>
                                            )}

                                            {(fromAccount || toAccount) && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                                        {isTransfer
                                                            ? `${fromAccount ?? "Unknown"} → ${toAccount ?? "Unknown"}` : fromAccount ?? "Uncategorized"
                                                        }
                                                    </span>
                                                </>
                                            )}

                                            {transaction.tags && transaction.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 items-center">
                                                    {transaction.tags.map((tag, i) => (
                                                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{tag}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : transaction.type === "expense" ? "text-red-600" : "text-muted-foreground"}`}>
                                            {transaction.type === "income" ? "+" : transaction.type === "expense" ? "-" : ""}{currencySymbol}{transaction.amount.toFixed(2)}
                                        </span>

                                        <Button variant="ghost" size="sm" onClick={() => onDuplicate(transaction.id)} aria-label="Duplicate transaction">
                                            <Copy className="h-3.5 w-3.5" />
                                        </Button>

                                        {!isSavingsCategory(transaction.category) && !isTransfer ? (
                                            <Button variant="ghost" size="sm" onClick={() => onEditClick(transaction)} aria-label="Edit transaction">✎</Button>
                                        ) : (
                                            <span className="w-8" />
                                        )}
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(transaction.id)} aria-label="Delete transaction">✕</Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <PaginationUI currentPage={currentPage} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />

                    {selectedIds.size > 0 && (
                        <div className="sticky bottom-4 z-50 mt-4 flex items-center justify-between gap-4 rounded-xl border bg-background p-3 shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{selectedIds.size} selected</span>
                                <Button variant="default" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Select value="" onValueChange={(value) => {
                                    if (value) {
                                        onBulkCategorize(Array.from(selectedIds), value)
                                        setSelectedIds(new Set())
                                    }
                                }}>
                                    <SelectTrigger className="h-8 w-40 text-sm">
                                        <SelectValue placeholder="Categorize..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>{category}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button variant="destructive" size="sm" onClick={() => {
                                    onBulkDelete(Array.from(selectedIds))
                                    setSelectedIds(new Set())
                                }}>Delete</Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}