import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import type { Transaction } from "@/types/transaction"
import { FieldError } from "../fieldError"
import { Label } from "../ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { autoCategories } from "@/lib/rules"
import type { Rule } from "@/types/rule"
import type { Account } from "@/types/account"

type EditTransactionDialogThings = {
    transaction: Transaction | null
    open: boolean
    onClose: () => void
    onSave: (id: string, description: string, amount: number, type: "income" | "expense" | "transfer", category: string, notes?: string) => void
    categories: string[]
    budgets: Record<string, number>
    categoryTotals: Record<string, number>
    currencySymbol: string
    rules: Rule[]
    accounts: Account[]
}

export function EditTransactionDialog({ transaction, open, onClose, onSave, categories, budgets, categoryTotals, currencySymbol, rules, accounts }: EditTransactionDialogThings) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState<"income" | "expense" | "transfer">("expense")
    const [category, setCategory] = useState("")
    const [notes, setNotes] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const currentLimit = budgets[category] ?? 0
    const currentSpent = (categoryTotals[category] ?? 0) - (transaction?.amount ?? 0)
    const projectedSpent = currentSpent + (Number(amount) || 0)
    const willExceedBudget = currentLimit > 0 && projectedSpent > currentLimit

    useEffect(() => {
        if (open && transaction) {
            setDescription(transaction.description)
            setAmount(transaction.amount.toString())
            setType(transaction.type)
            setCategory(transaction.category)
            setNotes(transaction.notes ?? "")
            setErrors({})
        }
    }, [open, transaction])

    function validate() {
        const newErrors: Record<string, string>= {}
        const parsedAmount = Number(amount)
        if (!description.trim()) {
            newErrors.description = "Description is required"
        }
        if (!amount || Number.isNaN(parsedAmount)) {
            newErrors.amount = "Please enter a valid amount"
        } else if (parsedAmount <= 0) {
            newErrors.amount = "Amount must be greater than 0"
        }
        if (!category) {
            newErrors.category = "Please select a category"
        }
        setErrors(newErrors)
        return (
            Object.keys(newErrors).length === 0
        )
    }

    function handleSave() {
        if (!transaction) {
            return
        }
        if (validate()) {
            onSave(transaction.id, description, Number(amount), type, category, notes)
            onClose()
        }
    }

    return (
        <Dialog open={open} onOpenChange={(value) => { if (!value) onClose() }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
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
                        <Select value={type} onValueChange={(value) => setType(value as "income" | "expense" | "transfer")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="transfer">Transfer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select value={category} onValueChange={(value) => { 
                            setCategory(value); 
                            if (errors.category) {
                                setErrors((p) => ({ ...p, category: "" })) }}
                            }>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>

                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError message={errors.category} />
                    </div>

                    <div>
                        <Label>Amount</Label>
                        <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => {
                            setAmount(e.target.value);
                            if (errors.amount) setErrors((p) => ({ ...p, amount: "" }))
                        }} placeholder="5" />
                        <FieldError message={errors.amount} />

                        {willExceedBudget && (
                            <p className="text-xs text-red-500 mt-1">This will exceed your budget limit of {currencySymbol}{currentLimit.toFixed(2)} for {category}. (Projected: {currencySymbol}{projectedSpent.toFixed(2)})</p>
                        )}
                    </div>

                    <div>
                        <Label>Notes (optional)</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any extra details here..." className="resize-none" rows={2} />
                    </div>

                    <Button className="w-full" onClick={handleSave}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

