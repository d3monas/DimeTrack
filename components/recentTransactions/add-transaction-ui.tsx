import { useState } from "react"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FieldError } from "../fieldError"
import { Checkbox } from "../ui/checkbox"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { recurringIntervalLabels } from "@/lib/consts"
import { Textarea } from "../ui/textarea"
import type { TransactionSplit } from "@/types/transaction"
import { autoCategories } from "@/lib/rules"
import type { Rule } from "@/types/rule"
import type { Account } from "@/types/account"

type AddTransactionDialogThings = {
    open: boolean
    setOpen: (open: boolean) => void
    description: string
    setDescription: (value: string) => void
    amount: string
    setAmount: (value: string) => void
    transactionType: "income" | "expense" | "transfer"
    setTransactionType: (value: "income" | "expense" | "transfer") => void
    categories: string[]
    category: string
    setCategory: (value: string) => void
    notes: string
    setNotes: (value: string) => void
    onSave: (isRecurring: boolean,
        interval: RecurringTransaction["interval"],
        customIntervalValue?: number,
        customIntervalUnit?: "days" | "weeks" | "months",
        splits?: TransactionSplit[],
        accountId?: string,
        transferAccountId?: string) => void
    onAddNewCategory: (name: string) => void
    budgets: Record<string, number>
    categoryTotals: Record<string, number>
    currencySymbol: string
    rules: Rule[]
    accounts: Account[]
}

export function AddTransactionDialog({
    open, setOpen, description, setDescription, amount, setAmount, transactionType,
    setTransactionType, category, setCategory, onSave, categories, notes, setNotes,
    onAddNewCategory, budgets, categoryTotals, currencySymbol, rules, accounts
}: AddTransactionDialogThings) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isRecurring, setIsRecurring] = useState(false)
    const [interval, setInterval] = useState<RecurringTransaction["interval"]>("monthly")
    const [customValue, setCustomValue] = useState("1")
    const [customUnit, setCustomUnit] = useState<"days" | "weeks" | "months">("weeks")
    const [isSplit, setIsSplit] = useState(false)
    const [splits, setSplits] = useState<TransactionSplit[]>([{ amount: 0, category: "" }])
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [accountId, setAccountId] = useState<string>("")
    const [transferAccountId, setTransferAccountId] = useState<string>("")

    const currentLimit = budgets[category] ?? 0
    const currentSpent = categoryTotals[category] ?? 0
    const projectedSpent = currentSpent + (Number(amount) || 0)
    const willExceedBudget = currentLimit > 0 && projectedSpent > currentLimit

    function validate() {
        const newErrors: Record<string, string> = {}
        const parsedAmount = Number(amount)
        if (!description.trim()) {
            newErrors.description = "Description is required"
        }
        if (isSplit) {
            const totalSplits = splits.reduce((sum, s) => sum + Number(s.amount), 0)
            if (Math.abs(totalSplits - parsedAmount) > 0.01) {
                newErrors.amount = `Split total ($${totalSplits.toFixed(2)}) must equal amount ($${parsedAmount.toFixed(2)})`
            }
            if (splits.some(s => !s.category || Number(s.amount) <= 0)) {
                newErrors.splits = "All splits must have a category and amount greater than 0"
            }
        } else {
            if (!amount.trim() || Number.isNaN(parsedAmount)) {
                newErrors.amount = "Please enter a valid amount"
            } else if (parsedAmount <= 0) {
                newErrors.amount = "Amount must be greater than 0"
            }
            if (!category && transactionType !== "transfer") {
                newErrors.category = "Please select a category"
            }
        }
        if (isRecurring && interval === "custom") {
            const parsedCustom = Number(customValue)
            if (!customValue || Number.isNaN(parsedCustom) || parsedCustom <= 0) {
                newErrors.customValue = "Enter a valid number"
            }
        }
        setErrors(newErrors)
        return (
            Object.keys(newErrors).length === 0
        )
    }

    function resetRecurringState() {
        setIsRecurring(false)
        setInterval("monthly")
        setCustomValue("1")
        setCustomUnit("weeks")
    }

    function handleSave() {
        if (validate()) {
            onSave(isRecurring,
                interval,
                interval === "custom" ? Number(customValue) : undefined,
                interval === "custom" ? customUnit : undefined,
                isSplit ? splits : undefined,
                accountId,
                transactionType === "transfer" ? transferAccountId : undefined
            )
            setErrors({})
            resetRecurringState()
            setIsSplit(false)
            setSplits([{ amount: 0, category: "" }])
            setAccountId("")
            setTransferAccountId("")
        }
    }

    function handleOpenChange(value: boolean) {
        setOpen(value)
        if (!value) {
            setErrors({})
            resetRecurringState()
            setAccountId("")
            setTransferAccountId("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>Add Transaction</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Description</Label>
                        <Input value={description} onChange={(e) => {
                            const text = e.target.value
                            setDescription(text)

                            const matchedCategory = autoCategories(text, rules)
                            if (matchedCategory) {
                                setCategory(matchedCategory)
                                if (errors.category) {
                                    setErrors((p) => ({ ...p, category: "" }))
                                }
                                if (errors.description) {
                                    setErrors((p) => ({ ...p, description: "" }))
                                }
                            }
                        }} placeholder="Coffee" />
                        <FieldError message={errors.description} />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select value={transactionType} onValueChange={(value) => setTransactionType(value as "expense" | "income" | "transfer")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Total Amount</Label>
                        <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => {
                            setAmount(e.target.value);
                            if (errors.amount) setErrors((p) => ({ ...p, amount: "" }))
                        }} placeholder="100" />
                        <FieldError message={errors.amount} />

                        {willExceedBudget && !isSplit && (
                            <p className="text-xs text-red-500 mt-1">This will exceed your budget limit of {currencySymbol}{currentLimit.toFixed(2)} for {category}. (Projected: {currencySymbol}{projectedSpent.toFixed(2)})</p>
                        )}
                    </div>

                    {transactionType === "transfer" ? (
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>From Account</Label>
                                <Select value={accountId} onValueChange={setAccountId}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>To Account</Label>
                                <Select value={transferAccountId} onValueChange={setTransferAccountId}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        {accounts.map((account) => (
                                            <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Label>Account (Optional)</Label>
                            <Select value={accountId} onValueChange={setAccountId}>
                                <SelectTrigger><SelectValue placeholder="Uncategorized" /></SelectTrigger>
                                <SelectContent>
                                    {accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div>
                        <Label>Notes (optional)</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any extra details here..." className="resize-none" rows={2} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox id="recurring" checked={isRecurring} onCheckedChange={(checked) => setIsRecurring(checked === true)} />
                        <Label htmlFor="recurring" className="cursor-pointer">Recurring transaction</Label>
                    </div>

                    {transactionType !== "transfer" && (
                        <div className="flex items-center gap-2">
                            <Checkbox id="split" checked={isSplit} onCheckedChange={(checked) => setIsSplit(checked === true)} />
                            <Label htmlFor="split" className="cursor-pointer">Split into multiple categories</Label>
                        </div>
                    )}

                    {transactionType !== "transfer" && (
                        isSplit ? (
                            <div className="space-y-3 rounded-lg border p-3">
                                {errors.splits && <FieldError message={errors.splits} />}
                                {splits.map((split, i) => (
                                    <div key={i} className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Category</Label>
                                            <Select value={split.category} onValueChange={(value) => {
                                                const newSplits = [...splits]
                                                newSplits[i].category = value
                                                setSplits(newSplits)
                                            }}>
                                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category} value={category}>{category}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-24">
                                            <Label>Amount</Label>
                                            <Input type="number" min="0.01" step="0.01" value={split.amount || ""} onChange={(e) => {
                                                const newSplits = [...splits]
                                                newSplits[i].amount = Number(e.target.value)
                                                setSplits(newSplits)
                                            }} />
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => {
                                            if (splits.length > 1) {
                                                setSplits(splits.filter((_, a) => a !== i))
                                            }
                                        }}>✕</Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => setSplits([...splits, { amount: 0, category: "" }])}>Add split</Button>
                            </div>
                        ) : (
                            <div>
                                <Label>Category</Label>
                                {isAddingCategory ? (
                                    <div className="flex gap-2">
                                        <Input
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Category name"
                                        />
                                        <Button size="sm" type="button" onClick={() => {
                                            if (newCategoryName.trim()) {
                                                onAddNewCategory(newCategoryName.trim())
                                                setCategory(newCategoryName.trim())
                                                setNewCategoryName("")
                                                setIsAddingCategory(false)
                                                if (errors.category) {
                                                    setErrors((p) => ({ ...p, category: "" }))
                                                }
                                            }
                                        }}>Add</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setIsAddingCategory(false)}>Cancel</Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Select value={category} disabled={categories.length === 0} onValueChange={(value) => {
                                            setCategory(value)
                                            if (errors.category) {
                                                setErrors((p) => ({ ...p, category: "" }))
                                            }
                                        }}>
                                            <SelectTrigger className="flex-1"><SelectValue placeholder={categories.length === 0 ? "No categories found" : "Select a category"} /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button size="sm" variant="outline" onClick={() => setIsAddingCategory(true)}>+ New</Button>
                                    </div>
                                )}
                                <FieldError message={errors.category} />
                            </div>
                        )
                    )}
                    {isRecurring && (
                        <div className="space-y-3">
                            <div>
                                <Label>Repeat every</Label>
                                <Select value={interval} onValueChange={(value) => {
                                    setInterval(value as RecurringTransaction["interval"])
                                    if (errors.customValue) {
                                        setErrors((p) => ({ ...p, customValue: "" }))
                                    }
                                }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {(Object.keys(recurringIntervalLabels) as RecurringTransaction["interval"][]).map((i) => (
                                            <SelectItem key={i} value={i}>{recurringIntervalLabels[i]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {interval === "custom" && (
                                <div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <Label>Every</Label>
                                            <Input type="number" min="1" value={customValue}
                                                onChange={(e) => { setCustomValue(e.target.value); if (errors.customValue) setErrors((p) => ({ ...p, customValue: "" })) }}
                                                placeholder="2" />
                                        </div>
                                        <div className="flex-1">
                                            <Select value={customUnit} onValueChange={(value) => setCustomUnit(value as "days" | "weeks" | "months")}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="days">Days</SelectItem>
                                                    <SelectItem value="weeks">Weeks</SelectItem>
                                                    <SelectItem value="months">Months</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <FieldError message={errors.customValue} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Button className="w-full" onClick={handleSave}>Save Transaction</Button>
            </DialogContent>
        </Dialog>
    )
}