import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dispatch, SetStateAction, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { isSavingsCategory } from "@/lib/consts"
import { RecurringManager } from "./recurringManager"
import type { RecurringTransaction } from "@/types/recurringTransaction" 

type SettingsDialogThings = {
    categories: string[]
    onDeleteCategory: (category: string) => void
    newCategory: string
    setNewCategory: Dispatch<SetStateAction<string>>
    onAddNewCategory: () => void
    currency: string
    currencySymbol: string
    onCurrencyChange: (value: string) => void
    recurring: RecurringTransaction[]
    onDeleteRecurring: (id: string) => void
    onImportCSV: (file: File) => void
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
    categories, onDeleteCategory, newCategory, setNewCategory, onAddNewCategory, currency, currencySymbol, onCurrencyChange, recurring, onDeleteRecurring, onImportCSV
}: SettingsDialogThings) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Settings</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Categories</h3>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category" />
                            <Button onClick={onAddNewCategory}>Add</Button>
                        </div>
                        <div className="space-y-2 mt-4">
                            {categories.map((category) => (
                                <div key={category} className="flex flex-wrap items-center justify-between gap-2 rounded-md p-2">
                                    <span className="break-all">{category}</span>
                                    {isSavingsCategory(category) ? (
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
                            currencySymbol={currencySymbol}
                            onDelete={onDeleteRecurring} 
                            />
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Data Management</h3>
                        <p className="text-sm text-muted-foreground mb-3">Import transactions from a CSV file</p>
                        <Input type="file" accept=".csv" ref={fileInputRef} className="hidden" 
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    onImportCSV(file)
                                    e.target.value = ""
                                }
                            }} />
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Import CSV</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}