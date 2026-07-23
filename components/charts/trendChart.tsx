import { XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, LineChart, Line } from "recharts"
import { EmptyState } from "../emptyState"
import { chartTooltipStyle } from "@/lib/chartStyles"
import { TRENDCHART_EXPENSES_COLOR, TRENDCHART_INCOME_COLOR } from "@/lib/consts"

type TrendChartThings = {
    data: { month: string, income: number, expenses: number }[]
    currencySymbol: string
}

export function TrendChart({ data, currencySymbol }: TrendChartThings) {
    const hasData = data.some(month => month.income > 0 || month.expenses > 0)

    if (!hasData) {
        return (
            <div className="mt-6 rounded-2xl border p-4 sm:p-6">
                <h2 className="mb-4 text-xl font-semibold">Income vs Expenses (Last 6 Months)</h2>
                <EmptyState message="Your 6-month trend will appear here as soon as you add some transactions" />
            </div>
        )
    }

    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return (
                `${currencySymbol}${(value / 1000000).toFixed(1)}M`
            )
        }
        if (value >= 1000) {
            return (
                `${currencySymbol}${(value / 1000).toFixed(0)}k`
            )
        }
        return (
            `${currencySymbol}${value}`
        )
    }

    return (
        <div className="mt-6 rounded-2xl border p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold">Income vs Expenses (Last 6 Months)</h2>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} fill="hsl(var(--muted-foreground))" />
                        <YAxis tickFormatter={(formatYAxis)} tickLine={false} axisLine={false} fontSize={12} width={70} fill="hsl(var(--muted-foreground))" />
                        <Tooltip formatter={(value, name) => [
                            `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            name === "income" ? "Income" : "Expenses"
                        ]}
                            {...chartTooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />

                        <Line type="monotone" dataKey="income" name="Income" stroke={TRENDCHART_INCOME_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="expenses" name="Expenses" stroke={TRENDCHART_EXPENSES_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}