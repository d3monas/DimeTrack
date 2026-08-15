import { CalendarDays, TrendingUp, TrendingDown, AlertTriangle, Info, Lightbulb, type LucideIcon } from "lucide-react"
import { Insight } from "@/lib/calculations/calculations"
import { cn } from "@/lib/utils"

type SmartStatsThings = {
    monthlyExpenses: number
    currencySymbol: string
    insights: Insight[]
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

export function SmartStats({ monthlyExpenses, currencySymbol, insights }: SmartStatsThings) {
    const now = new Date()
    const dayOfMonth = now.getDate()
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    const dailyAverage = monthlyExpenses / dayOfMonth
    const projectedSpending = dailyAverage * daysInMonth

    const lastDayDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const monthName = lastDayDate.toLocaleDateString("default", { month: "long" })
    const lastDay = lastDayDate.getDate()
    const endOfMonthLabel = `${monthName} ${lastDay}`

    const getIconAndColor = (type: Insight["type"]) => {
        switch (type) {
            case "positive": return {
                icon: TrendingUp,
                bgColor: "bg-green-500/10",
                textColor: "text-green-600"
            }
            case "negative": return {
                icon: TrendingDown,
                bgColor: "bg-red-500/10",
                textColor: "text-red-600"
            }
            case "warning": return {
                icon: AlertTriangle,
                bgColor: "bg-orange-500/10",
                textColor: "text-orange-600"
            }
            case "info": return {
                icon: Info,
                bgColor: "bg-blue-500/10",
                textColor: "text-blue-600"
            }
            default: return {
                icon: Lightbulb,
                bgColor: "bg-muted",
                textColor: "text-muted-foreground"
            }
        }
    }

    return (
        <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 sm:gap-6">
                <StatCard icon={CalendarDays} label="Daily Average (This Month)" value={`${currencySymbol}${dailyAverage.toFixed(2)}`}
                    subText={`Based on ${dayOfMonth} days passed this month`} />

                <StatCard icon={TrendingUp} label="Projected End of Month Spending" value={`${currencySymbol}${projectedSpending.toFixed(2)}`}
                    subText={`At this pace, you will spend this much by ${endOfMonthLabel}`} />
            </div>

            {insights.length > 0 && (
                <div className="rounded-2xl border p-4 sm:p-6">
                    <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" /> Insights
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                        {insights.map((insight, i) => {
                            const { icon: Icon, bgColor, textColor } = getIconAndColor(insight.type)
                            return (
                                <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl", bgColor)}>
                                    <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", textColor)} />
                                    <p className="text-sm text-foreground/90 font-medium">{insight.text}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}