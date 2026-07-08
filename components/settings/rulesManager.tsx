import { useState } from "react"
import type { Rule } from "@/types/rule"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { SelectTrigger, Select, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { Button } from "../ui/button"
import { EmptyState } from "../emptyState"

type RulesManagerThings = {
    rules: Rule[]
    categories: string[]
    onAddRule: (contains: string, category: string) => void
    onDeleteRule: (id: string) => void
}

export function RulesManager({ rules, categories, onAddRule, onDeleteRule }: RulesManagerThings) {
    const [contains, setContains] = useState("")
    const [category, setCategory] = useState("")

    function handleAdd() {
        if (!contains.trim() || !category) {
            return
        }
        onAddRule(contains.trim(), category)
        setContains("")
        setCategory("")
    }

    return (
        <div>
            <h3 className="font-semibold mb-2">Auto-Categorization Rules</h3>
            <p className="text-sm text-muted-foreground mb-3">If a transaction contains a set keyword, it will automatically be assigned to a category</p>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="flex-1">
                    <Label>If description contains</Label>
                    <Input value={contains} onChange={(e) => setContains(e.target.value)} placeholder="e.g. Breakfast" className="mt-3" />
                </div>
                <div className="flex-1">
                    <Label>Set category to</Label>
                    <Select value={category} onValueChange={setCategory} disabled={categories.length === 0}>
                        <SelectTrigger className="mt-3"><SelectValue placeholder={categories.length === 0 ? "No categories" : "Select"} /></SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleAdd} disabled={!contains.trim() || !category}>Add Rule</Button>
            </div>

            <div className="space-y-2 mt-4">
                {rules.length === 0 ? (
                    <EmptyState message="No rules yet" />
                ) : (
                    rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between rounded-md border p-2">
                            <div className="text-sm">
                                <span className="text-muted-foreground">If contains </span>
                                <span className="font-medium">"{rule.contains}"</span>
                                <span className="text-muted-foreground"> &rarr; </span>
                                <span className="font-medium">{rule.category}</span>
                            </div>
                            <Button variant="destructive" size="sm" onClick={() => onDeleteRule(rule.id)}>Delete</Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}