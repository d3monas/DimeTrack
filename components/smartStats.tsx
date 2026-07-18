import type { LucideIcon } from "lucide-react";

type SmartStatsThings = {
    monthlyExpenses: number
    currencySymbol: string
}

type StatCardThings = {
    icon: LucideIcon
    label: string
    value: string
    subtext: string
}

export function SmartStats({ }: SmartStatsThings) {
}