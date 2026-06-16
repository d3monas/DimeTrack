import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dispatch, SetStateAction } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { defaultSavingsCategory } from "@/lib/consts"
import { RecurringManager } from "./recurringManager"
import type { RecurringTransaction } from "@/types/recurringTransaction" 

type SettingsDialogThings = {
    categories: string[]
    onDeleteCategory: (category: string) => void
    newCategory: string
    setNewCategory: Dispatch<SetStateAction<string>>
    onAddNewCategory: () => void
    currency: string
    onCurrencyChange: (value: string) => void
    recurring: RecurringTransaction[]
    onAddRecurring: (recurring: Omit<RecurringTransaction, "id" | "lastProcessedDate">) => void
    onDeleteRecurring: (id: number) => void
}

const currencies = [
    { code: "USD", label: "USD - US Dollar ($)" },
    { code: "EUR", label: "EUR - Euro (€)" },
    { code: "GBP", label: "GBP - British Pound (£)" },
    { code: "JPY", label: "JPY - Japanese Yen (¥)" },
    { code: "CAD", label: "CAD - Canadian Dollar (CA$)" },
    { code: "AUD", label: "AUD - Australian Dollar (A$)" },
    { code: "CHF", label: "CHF - Swiss Franc (Fr)" },
    { code: "INR", label: "INR - Indian Rupee (₹)" },
]

export function SettingsDialog({
    categories, onDeleteCategory, newCategory, setNewCategory, onAddNewCategory, currency, onCurrencyChange, recurring, onAddRecurring, onDeleteRecurring
}: SettingsDialogThings) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Settings</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Categories</h3>
                        <div className="flex gap-2">
                            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category" />
                            <Button onClick={onAddNewCategory}>Add</Button>
                        </div>
                        <div className="space-y-2 mt-4">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center justify-between rounded-md p-2">
                                    <span>{category}</span>
                                    {category === defaultSavingsCategory ? (
                                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-md border">Default</span>
                                    ) : (
                                        <Button variant="destructive" size="sm" onClick={() => onDeleteCategory(category)}>Delete</Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Currency</h3>
                        <Select value={currency} onValueChange={onCurrencyChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((currency) => (
                                    <SelectItem key={currency.code} value={currency.code}>{currency.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <RecurringManager 
                            recurring={recurring} 
                            categories={categories} 
                            onAdd={onAddRecurring}
                            onDelete={onDeleteRecurring} 
                            />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}