import { useState } from "react"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { defaultSavingsCategory } from "@/lib/consts"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FieldError } from "../fieldError"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type RecurringManagerThings = {
    recurring: RecurringTransaction[]
    categories: string[]
    onAdd: (recurring: Omit<RecurringTransaction, "id" | "lastProcessedDate">) => void
    onDelete: (id: number) => void
}

const intervalLabels: Record<RecurringTransaction["interval"], string> = {
    daily: "Daily", weekly: "Weekly", monthly: "Monthly", yearly: "Yearly"
}

export function RecurringManager({ recurring, categories, onAdd, onDelete }: RecurringManagerThings) {
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")
    const [type, setType] = useState<"income" | "expense">("expense")
    const [category, setCategory] = useState("")
    const [interval, setInterval] = useState<RecurringTransaction["interval"]>("monthly")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const filteredCategories = categories.filter(category => category !== defaultSavingsCategory)

    function validate() {
        const newErrors: Record<string, string> = {}
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

    function handleAdd() {
        if (!validate()) {
            return
        }
        onAdd({ description, amount: Number(amount), type, category, interval })
        setDescription("")
        setAmount("")
        setType("expense")
        setCategory("")
        setInterval("monthly")
        setErrors({})
    }

    return (
        <>
        <div>
            <h3 className="font-semibold mb-3">Recurring Transactions</h3>

            <div className="space-y-3 mb-4">
                <div>
                    <Label>Description</Label>
                    <Input value={description} onChange={(e) => {
                        setDescription(e.target.value)
                        if (errors.description) setErrors(p => ({ ...p, description: "" }))
                    }} placeholder="Netflix" />
                    <FieldError message={errors.description} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                    <Label>Interval</Label>
                    <Select value={interval} onValueChange={(value) => setInterval(value as RecurringTransaction["interval"])}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {(Object.keys(intervalLabels) as RecurringTransaction["interval"][]).map((i) => (
                                <SelectItem key={i} value={i}>{intervalLabels[i]}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => {
                    setCategory(v)
                    if (errors.category) setErrors(p => ({ ...p, category: "" }))
                }} disabled={filteredCategories.length === 0}>
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder={filteredCategories.length === 0 ? "No categories":"Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FieldError message={errors.category} />
            </div>

            <div>
                <Label>Amount</Label>
                <Input type="number" min="0.01" step="0.01" value={amount} placeholder="9.99" onChange={(e) => {
                    setAmount(e.target.value)
                    if (errors.amount) {
                        setErrors(p => ({ ...p, amount: "" }))
                    }
                }} />
                <FieldError message={errors.amount} />
            </div>

            <Button className="w-full" onClick={handleAdd}>Add Recurring Transaction</Button>
        </div>
        
        {recurring.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recurring transactions yet</p>
        ):(
            <div className="space-y-2">
                {recurring.map((recurring) => (
                <div key={recurring.id} className="flex items-center justify-between rounded-md border p-3">
                    <div>
                        <p className="font-medium text-sm">{recurring.description}</p>
                        <p className="text-xs text-muted-foreground">{intervalLabels[recurring.interval]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${recurring.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {recurring.type === "income" ? "+" : "-"}{recurring.amount.toFixed(2)}
                        </span>
                    </div>
                </div>
                ))}
            </div>
        )}
        </>
    )
}