import type { Rule } from "@/types/rule"

export function autoCategories(description: string, rules: Rule[]): string | null {
    if (!description || rules.length == 0) {
        return null
    }
    const lowerDesc = description.toLowerCase()
    const matchedRule = rules.find((rule) => lowerDesc.includes(rule.contains.toLowerCase()))

    return (
        matchedRule ? matchedRule.category : null
    )
}