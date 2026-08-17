import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { EmptyState } from "./emptyState"
import { TrendingUp, TrendingDown, CalendarClock, Wallet, ArrowDownUp, AlertTriangle, ShieldAlert, CalendarIcon } from "lucide-react"
import { getNextDate } from "@/lib/recurring"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { AreaChart, Area, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts"
import { chartTooltipStyle } from "@/lib/chartStyles"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar } from "./ui/calendar"

type CashFlowTimelineThings = {
    currentBalance: number
    recurring: RecurringTransaction[]
    currencySymbol: string
}

type TimelineEvent = {
    date: Date
    description: string
    amount: number
    type: "income" | "expense" | "transfer"
}

export function CashFlowTimeline({ currentBalance, recurring, currencySymbol }: CashFlowTimelineThings) {
    const [filterValue, setFilterValue] = useState<"7days" | "1month" | "3months" | "custom">("7days")
    const [customDate, setCustomDate] = useState<Date | undefined>(undefined)
    const [safetyBuffer, setSafetyBuffer] = useState<number>(0)

    const { timelineGroups, chartData, projectedBalance, minBalance, filterLabel } = useMemo(() => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)
        const futureDate = new Date(now)
        let label = "7 days"

        if (filterValue === "7days") {
            futureDate.setDate(now.getDate() + 7)
            label = "7 days"
        } else if (filterValue === "1month") {
            futureDate.setMonth(now.getMonth() + 1)
            label = "1 month"
        } else if (filterValue === "3months") {
            futureDate.setMonth(now.getMonth() + 3)
            label = "3 months"
        } else if (filterValue === "custom" && customDate) {
            futureDate.setTime(customDate.getTime())
            label = customDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        }

        const events: TimelineEvent[] = []

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

        let running = currentBalance
        let minBal = currentBalance
        const chartData = [{ date: "Today", balance: running }]

        const monthGroupsMap: Record<string, { monthName: string, daysMap: Record<string, { date: Date, events: TimelineEvent[], dayEndBalance: number }> }> = {}

        events.forEach((ev) => {
            if (ev.type === "income") running += ev.amount
            else if (ev.type === "expense") running -= ev.amount

            if (running < minBal) minBal = running

            const chartDateStr = ev.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
            chartData.push({ date: chartDateStr, balance: running })

            const monthName = ev.date.toLocaleDateString(undefined, { month: "long", year: "numeric" })
            if (!monthGroupsMap[monthName]) {
                monthGroupsMap[monthName] = { monthName, daysMap: {} }
            }

            const dayStr = ev.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
            if (!monthGroupsMap[monthName].daysMap[dayStr]) {
                monthGroupsMap[monthName].daysMap[dayStr] = { date: ev.date, events: [], dayEndBalance: running }
            }

            monthGroupsMap[monthName].daysMap[dayStr].dayEndBalance = running
            monthGroupsMap[monthName].daysMap[dayStr].events.push(ev)
        })

        const timelineGroups = Object.values(monthGroupsMap).map(monthGroup => ({
            monthName: monthGroup.monthName,
            days: Object.values(monthGroup.daysMap).sort((a, b) => a.date.getTime() - b.date.getTime())
        }))

        return { timelineGroups, chartData, projectedBalance: running, minBalance: minBal, filterLabel: label }
    }, [recurring, filterValue, currentBalance, customDate])

    const isProjectionPositive = projectedBalance >= currentBalance
    const hasNegativeDip = minBalance < 0

    return (
        <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-primary" /> Cash Flow Timeline
                    </h2>
                    <p className="text-sm text-muted-foreground">Current balance: <span className="font-bold text-foreground">{currencySymbol}{currentBalance.toFixed(2)}</span></p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2 rounded-lg border p-1">
                        <ShieldAlert className="w-4 h-4 text-orange-500 ml-1" />
                        <Input type="number" value={safetyBuffer || ""} onChange={(e) => setSafetyBuffer(Number(e.target.value))} placeholder="Buffer"
                            className="h-6 w-24 text-center text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                        />
                    </div>

                    <div className="flex gap-1 rounded-lg border p-1 w-fit">
                        <Button size="sm" variant={filterValue === "7days" ? "default" : "ghost"} onClick={() => setFilterValue("7days")} className="h-7">7 days</Button>
                        <Button size="sm" variant={filterValue === "1month" ? "default" : "ghost"} onClick={() => setFilterValue("1month")} className="h-7">1 month</Button>
                        <Button size="sm" variant={filterValue === "3months" ? "default" : "ghost"} onClick={() => setFilterValue("3months")} className="h-7">3 months</Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button size="sm" variant={filterValue === "custom" ? "default" : "ghost"} className="h-7 px-2">
                                    <CalendarIcon className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={customDate} onSelect={(date) => { setCustomDate(date); setFilterValue("custom") }}
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
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
                    <p className="text-xs text-muted-foreground mt-1">In {filterLabel}</p>

                    {safetyBuffer > 0 && minBalance < safetyBuffer && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-500/10 p-2 rounded-md">
                            <AlertTriangle className="w-4 h-4" />
                            Warning: Balance drops below safety buffer ({currencySymbol}{safetyBuffer.toFixed(2)}) during this period
                        </div>
                    )}

                    {hasNegativeDip && (
                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600 bg-red-500/10 p-2 rounded-md">
                            <AlertTriangle className="h-4 w-4" />
                            Warning: Balance drops below zero during this period
                        </div>
                    )}
                </div>

                <div className="rounded-xl border p-2">
                    <div className="h-24 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={isProjectionPositive ? "#22c55e" : "#ef4444"} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={isProjectionPositive ? "#22c55e" : "#ef4444"} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <Tooltip
                                    formatter={(value) => [`${currencySymbol}${Number(value).toFixed(2)}`, "Balance"]}
                                    {...chartTooltipStyle}
                                />
                                <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
                                {safetyBuffer > 0 && (
                                    <ReferenceLine y={safetyBuffer} stroke="#f97316" strokeDasharray="4 4" />
                                )}
                                <Area type="monotone" dataKey="balance" stroke={isProjectionPositive ? "#22c55e" : "#ef4444"} strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border p-4 sm:p-6">
                {timelineGroups.length === 0 ? (
                    <EmptyState message={`No recurring transactions expected in the next ${filterLabel}`} />
                ) : (
                    <div className="space-y-8">
                        {timelineGroups.map((monthGroup) => (
                            <div key={monthGroup.monthName}>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 pb-2 border-b">
                                    {monthGroup.monthName}
                                </h3>
                                <div className="space-y-6">
                                    {monthGroup.days.map((day) => {
                                        const isDayNegative = day.dayEndBalance < 0
                                        return (
                                            <div key={day.date.toISOString()} className="relative pl-6">
                                                <div className="absolute left-0 top-1 h-full w-px bg-border" />
                                                <div className={cn(
                                                    "absolute left-0.75 top-1.5 h-2 w-2 rounded-full ring-4 ring-background",
                                                    isDayNegative ? "bg-red-500" : "bg-primary"
                                                )} />

                                                <div className="flex items-center justify-between mb-2">
                                                    <span className={cn("text-sm font-semibold", isDayNegative ? "text-red-600" : "text-muted-foreground")}>
                                                        {day.date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                                                    </span>
                                                    <span className={cn(
                                                        "text-xs font-bold",
                                                        isDayNegative ? "text-red-600" : "text-muted-foreground"
                                                    )}>
                                                        {currencySymbol}{day.dayEndBalance.toFixed(2)}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    {day.events.map((ev, i) => (
                                                        <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-muted/30 p-2 transition-colors hover:bg-muted">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className={cn(
                                                                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                                                                    ev.type === "income" ? "bg-green-500/10" : ev.type === "expense" ? "bg-red-500/10" : "bg-blue-500/10"
                                                                )}>
                                                                    {ev.type === "income" ? <TrendingUp className="h-4 w-4 text-green-600" /> :
                                                                        ev.type === "expense" ? <TrendingDown className="h-4 w-4 text-red-600" /> :
                                                                            <ArrowDownUp className="h-4 w-4 text-blue-600" />}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium truncate">{ev.description}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {ev.type === "transfer" ? "Transfer" : "Recurring"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <span className={cn(
                                                                "text-sm font-semibold whitespace-nowrap",
                                                                ev.type === "income" ? "text-green-600" : ev.type === "expense" ? "text-red-600" : "text-muted-foreground"
                                                            )}>
                                                                {ev.type === "income" ? "+" : ev.type === "expense" ? "-" : ""}{currencySymbol}{ev.amount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}