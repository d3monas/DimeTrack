"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts"
import { EmptyState } from "../emptyState"
import type { MonthlyTrend } from "@/lib/calculations"

type TrendChartThings = {
    data: MonthlyTrend[]
    currencySymbol: string
}

function formatYAxis(value: number, currencySymbol: string) {
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

    return (
        <div className="mt-6 rounded-2xl border p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold">Income vs Expenses (Last 6 Months)</h2>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} fill="hsl(var(--muted-foreground))" />
                        <YAxis tickFormatter={(value) => formatYAxis(Number(value), currencySymbol)} tickLine={false} axisLine={false} fontSize={12} width={70} fill="hsl(var(--muted-foreground))" />
                        <Tooltip formatter={(value) => `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            cursor={{
                                fill: "hsl(var(--muted))",
                                opacity: 0.4
                            }}
                            contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "0.5rem",
                                color: "hsl(var(--muted-foreground))",
                                fontSize: "12px",
                                padding: "8px 12px",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                            }}
                            labelStyle={{
                                color: "hsl(var(--popover-foreground))",
                                fontWeight: 600,
                                marginBottom: "4px"
                            }}
                            itemStyle={{
                                color: "hsl(var(--popover-foreground))"
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}