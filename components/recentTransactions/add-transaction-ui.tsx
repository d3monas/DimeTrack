import { useState } from "react"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FieldError } from "../fieldError"

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
    onSave: () => void
}

export function AddTransactionDialog({
    open, setOpen, description, setDescription, amount, setAmount, transactionType, setTransactionType, category, setCategory, onSave, categories
}: AddTransactionDialogThings) {
    const [errors, setErrors] = useState<Record<string, string>>({})

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
        setErrors(newErrors)
        return (
            Object.keys(newErrors).length === 0
        )
    }

    function handleSave() {
        if (validate()) {
            onSave()
            setErrors({})
        }
    }

    function handleOpenChange(value: boolean) {
        setOpen(value)
        if (!value) {
            setErrors({})
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
                    <Button className="w-full" onClick={handleSave}>Save Transaction</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}