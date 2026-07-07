import { useState } from "react"
import type { Rule } from "@/types/rule"

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
        </div>
    )
}