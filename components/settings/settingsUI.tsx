import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Dispatch, SetStateAction, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { isSavingsCategory } from "@/lib/consts"
import { RecurringManager } from "./recurringManager"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { RulesManager } from "./rulesManager"
import type { Rule } from "@/types/rule"

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
    onExportBackup: () => void
    onImportBackup: (file: File) => void
    onClearData: () => void
    rules: Rule[]
    onAddRule: (contains: string, category: string) => void
    onDeleteRule: (id: string) => void
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
    categories, onDeleteCategory, newCategory, setNewCategory, onAddNewCategory, currency, currencySymbol, 
    onCurrencyChange, recurring, onDeleteRecurring, onImportCSV, onExportBackup, onImportBackup, onClearData,
    rules, onAddRule, onDeleteRule
}: SettingsDialogThings) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const backupInputRef = useRef<HTMLInputElement>(null)

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

                    <div className="border-t pt-4">
                        <RulesManager rules={rules} categories={categories} onAddRule={onAddRule} onDeleteRule={onDeleteRule} />
                    </div>

                    <div>
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

                        <div className="border-t mt-2">
                            <p className="text-sm text-muted-foreground mt-2">Transfer <b>ALL</b> your data between devices or browsers</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Button variant="outline" size="sm" onClick={onExportBackup}>Export Backup</Button>
                                <Input type="file" accept=".json" ref={backupInputRef} className="hidden" onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        onImportBackup(file)
                                        e.target.value = ""
                                    }
                                }} />
                                <Button variant="outline" size="sm" onClick={() => backupInputRef.current?.click()}>Import Backup</Button>
                            </div>
                        </div>

                        <div className="border-t border-red-500/30 pt-4 mt-4">
                            <h3 className="font-semibold mb-2 text-red-600">Danger</h3>  
                            <p className="text-sm text-muted-foreground mb-3">This will permanently delete <b>ALL</b> your data</p>
                            <Button variant="destructive" size="sm" onClick={() => {
                                if (confirm("Are you sure you want to wipe your data? This action cannot be undone.")) {
                                    onClearData()
                                }
                            }}>Clear all data</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}