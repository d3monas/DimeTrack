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

function StatCard({ icon: Icon, label, value, subtext }: StatCardThings) {
    return (
        <div className="rounded-2xl border p-4 sm:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
    )
}

export function SmartStats({ monthlyExpenses, currencySymbol }: SmartStatsThings) {
}