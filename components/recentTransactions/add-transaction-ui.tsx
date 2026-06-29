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

type AddTransactionDialogThings = {
    open: boolean
    setOpen: (open: boolean) => void
    description: string
    setDescription: (value: string) => void
    amount: string
    setAmount: (value: string) => void
    transactionType: "income" | "expense"
    setTransactionType: (value: "income" | "expense") => void
    categories: string[]
    category: string
    setCategory: (value: string) => void
    notes: string
    setNotes: (value: string) => void
    onSave: (isRecurring: boolean, interval: RecurringTransaction["interval"], customIntervalValue?: number, customIntervalUnit?: "days" | "weeks" | "months") => void
}

export function AddTransactionDialog({
    open, setOpen, description, setDescription, amount, setAmount, transactionType, setTransactionType, category, setCategory, onSave, categories, notes, setNotes
}: AddTransactionDialogThings) {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isRecurring, setIsRecurring] = useState(false)
    const [interval, setInterval] = useState<RecurringTransaction["interval"]>("monthly")
    const [customValue, setCustomValue] = useState("1")
    const [customUnit, setCustomUnit] = useState<"days" | "weeks" | "months">("weeks")

    function validate() {
        const newErrors: Record<string, string> = {}
        const parsedAmount = Number(amount)
        if (!description.trim()) {
            newErrors.description = "Description is required"
        }
        if (!amount.trim() || Number.isNaN(parsedAmount)) {
            newErrors.amount = "Please enter a valid amount"
        } else if (parsedAmount <= 0) {
            newErrors.amount = "Amount must be greater than 0"
        }
        if (!category) {
            newErrors.category = "Please select a category"
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
            onSave(isRecurring, interval, interval === "custom" ? Number(customValue) : undefined, interval === "custom" ? customUnit: undefined)
            setErrors({})
            resetRecurringState()
        }
    }

    function handleOpenChange(value: boolean) {
        setOpen(value)
        if (!value) {
            setErrors({})
            resetRecurringState()
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
                        <Input value={description} onChange={(e) => { setDescription(e.target.value); 
                            if (errors.description) setErrors((p) => ({ ...p, description: "" })) }} 
                            placeholder="Coffee" />
                        <FieldError message={errors.description} />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select value={transactionType} onValueChange={(value) => setTransactionType(value as "expense" | "income")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select value={category} onValueChange={(value) => { setCategory(value); 
                            if (errors.category) setErrors((p) => ({ ...p, category: "" })) }} disabled={categories.length === 0}>
                            <SelectTrigger>
                                <SelectValue placeholder={categories.length === 0 ? "No categories yet. To create a category, visit Settings" : "Select a category"} />
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
                        <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => { setAmount(e.target.value); 
                            if (errors.amount) setErrors((p) => ({ ...p, amount: "" })) }} placeholder="5" />
                        <FieldError message={errors.amount} />
                    </div>

                    <div>
                        <Label>Notes (optional)</Label>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add any extra details here..." className="resize-none" rows={2} />
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox id="recurring" checked={isRecurring} onCheckedChange={(checked) => setIsRecurring(checked === true)} />
                        <Label htmlFor="recurring" className="cursor-pointer">Recurring transaction</Label>
                    </div>

                    {isRecurring && (
                        <div className="space-y-3">
                            <div>
                                <Label>Repeat every</Label>
                                <Select value={interval} onValueChange={(value) => {
                                    setInterval(value as RecurringTransaction["interval"])
                                    if (errors.customValue) {
                                        setErrors((p) => ({ ...p, customValue: "" }))
                                    }}}>
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