import { CalendarDays, TrendingUp, type LucideIcon } from "lucide-react";

type SmartStatsThings = {
    monthlyExpenses: number
    currencySymbol: string
}

type StatCardThings = {
    icon: LucideIcon
    label: string
    value: string
    subText: string
}

function StatCard({ icon: Icon, label, value, subText }: StatCardThings) {
    return (
        <div className="rounded-2xl border p-4 sm:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground">{subText}</p>
        </div>
    )
}

export function SmartStats({ monthlyExpenses, currencySymbol }: SmartStatsThings) {
    const now = new Date()
    const dayOfMonth = now.getDate()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    const dailyAverage = monthlyExpenses / dayOfMonth
    const projectedSpending = dailyAverage * daysInMonth

    const lastDayDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const monthName = lastDayDate.toLocaleDateString("default", { month: "long" })
    const lastDay = lastDayDate.getDate()
    const endOfMonthLabel = `${monthName} ${lastDay}`

    return (
        <div className="mt-6 grid gap-4 md:grid-cols-2 sm:gap-6">
            <StatCard icon={CalendarDays} label="Daily Average (This Month)" value={`${currencySymbol}${dailyAverage.toFixed(2)}`} 
            subText={`Based on ${dayOfMonth} days passed this month`} />

            <StatCard icon={TrendingUp} label="Projected End of Month Spending" value={`${currencySymbol}${projectedSpending.toFixed(2)}`}
            subText={`At this pace, you will spend this much by ${endOfMonthLabel}`} />
        </div>
    )
}