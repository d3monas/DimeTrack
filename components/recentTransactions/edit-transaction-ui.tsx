import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Transaction } from "@/types/transaction"
import { FieldError } from "../fieldError"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type EditTransactionDialogThings = {
    transaction: Transaction | null
    open: boolean
    onClose: () => void
    onSave: (id: number, description: string, amount: number, type: "income" | "expense", category: string) => void
    categories: string[]
}

export function EditTransactionDialog({ transaction, open, onClose, onSave, categories }: EditTransactionDialogThings) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState<"income" | "expense">("expense")
    const [category, setCategory] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open && transaction) {
            setDescription(transaction.description)
            setAmount(transaction.amount.toString())
            setType(transaction.type)
            setCategory(transaction.category)
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
            onSave(transaction.id, description, Number(amount), type, category)
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
                        <Input value={description} placeholder="Coffee" onChange={(e) => {setDescription(e.target.value)
                            if (errors.description) {
                                setErrors((p) => ({
                                    ...p, description: ""
                                }))
                            }
                        }} />
                        <FieldError message={errors.description} />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(value) => setType(value as "income" | "expense")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select value={category} onValueChange={(value) => { setCategory(value); 
                            if (errors.category) {
                                setErrors((p) => ({ ...p, category: "" })) }}
                            }>
                            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
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
                    </div>
                    <Button className="w-full" onClick={handleSave}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

