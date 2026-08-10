import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { EmptyState } from "./emptyState"
import { TrendingUp, TrendingDown, CalendarClock, Wallet } from "lucide-react"
import { getNextDate } from "@/lib/recurring"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts"
import { chartTooltipStyle } from "@/lib/chartStyles"
import { cn } from "@/lib/utils"

type CashFlowTimelineThings = {
    currentBalance: number
    recurring: RecurringTransaction[]
    currencySymbol: string
}

const filterOptions = [
    { label: "7 days", value: 7 },
    { label: "30 days", value: 30 },
    { label: "3 months", value: 90 },
]

export function CashFlowTimeline({ currentBalance, recurring, currencySymbol }: CashFlowTimelineThings) {
    const [filterDays, setFilterDays] = useState(7)

    const { groupedEvents, chartData, projectedBalance } = useMemo(() => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const futureDate = new Date(now)
        futureDate.setDate(now.getDate() + filterDays)

        const events: { date: Date; description: string; amount: number; type: "income" | "expense" | "transfer" }[] = []

        recurring.forEach((rec) => {
            if (rec.isActive === false) return

            let nextDate = getNextDate(rec)
            while (nextDate < now) {
                nextDate = getNextDate({ ...rec, lastProcessedDate: nextDate.toISOString() })
            }

            while (nextDate <= futureDate) {
                events.push({
                    date: new Date(nextDate),
                    description: rec.description,
                    amount: rec.amount,
                    type: rec.type,
                })
                nextDate = getNextDate({ ...rec, lastProcessedDate: nextDate.toISOString() })
            }
        })

        events.sort((a, b) => a.date.getTime() - b.date.getTime())

        const groups: Record<string, typeof events> = {}
        events.forEach((ev) => {
            const dateStr = ev.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
            if (!groups[dateStr]) groups[dateStr] = []
            groups[dateStr].push(ev)
        })

        const groupedEvents = Object.entries(groups)

        let running = currentBalance
        const chartData = [{ date: "Today", balance: running }]

        events.forEach((ev) => {
            if (ev.type === "income") running += ev.amount
            else if (ev.type === "expense") running -= ev.amount

            const dateStr = ev.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
            chartData.push({ date: dateStr, balance: running })
        })

        return { groupedEvents, chartData, projectedBalance: running }
    }, [recurring, filterDays, currentBalance])

    const isProjectionPositive = projectedBalance >= currentBalance

    return (
        <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" /> Cash Flow Timeline
                    </h2>
                    <p className="text-sm text-muted-foreground">Current balance: <span className="font-bold text-foreground">{currencySymbol}{currentBalance.toFixed(2)}</span></p>
                </div>
                <div className="flex gap-1 rounded-lg border p-1 w-fit">
                    {filterOptions.map((opt) => (
                        <Button key={opt.value} size="sm" variant={filterDays === opt.value ? "default" : "ghost"} onClick={() => setFilterDays(opt.value)} className="h-7">
                            {opt.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="h-4 w-4" />
                        <span className="text-sm font-medium">Projected Balance</span>
                    </div>
                    <h3 className={`mt-2 text-2xl font-bold flex items-center gap-2 ${isProjectionPositive ? "text-green-600" : "text-red-600"}`}>
                        {isProjectionPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                        {currencySymbol}{projectedBalance.toFixed(2)}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">In {filterDays} days</p>
                </div>

                <div className="rounded-xl border p-2">
                    <div className="h-20 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isProjectionPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={isProjectionPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    formatter={(value) => [`${currencySymbol}${Number(value).toFixed(2)}`, "Balance"]}
                                    {...chartTooltipStyle}
                                />
                                <Area type="monotone" dataKey="balance" stroke={isProjectionPositive ? "#22c55e" : "#ef4444"} strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border p-4 sm:p-6">
                {groupedEvents.length === 0 ? (
                    <EmptyState message={`No recurring transactions expected in the next ${filterDays} days`} />
                ) : (
                    <div className="space-y-6">
                        {groupedEvents.map(([dateStr, events]) => (
                            <div key={dateStr} className="relative pl-6">
                                <div className="absolute left-0 top-1 h-full w-px bg-border" />
                                <div className="absolute left-0.75 top-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">{dateStr}</h3>
                                <div className="space-y-2">
                                    {events.map((ev, i) => (
                                        <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 p-2 transition-colors hover:bg-muted">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                    ev.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                                                )}>
                                                    {ev.type === "income" ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">{ev.description}</p>
                                                    <p className="text-xs text-muted-foreground">Recurring</p>
                                                </div>
                                            </div>

                                            <span className={cn("text-sm font-semibold whitespace-nowrap", ev.type === "income" ? "text-green-600" : "text-red-600")}>
                                                {ev.type === "income" ? "+" : "-"}{currencySymbol}{ev.amount.toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}