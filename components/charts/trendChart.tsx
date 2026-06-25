"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts"
import { EmptyState } from "../emptyState"
import type { MonthlyTrend } from "@/lib/calculations"

type TrendChartThings = {
    data: MonthlyTrend[]
    currencySymbol: string
}

export function TrendChart({ data, currencySymbol }: TrendChartThings) {
    const hasData = data.some(month => month.income > 0 || month.expenses > 0)

    if (!hasData) {
        return (
            <div className="mt-6 rounded-2xl border p-6">
                <h2 className="mb-4 text-xl font-semibold">Income vs Expenses (Last 6 Months)</h2>
                <EmptyState message="Your 6-month trend will appear here as soon as you add some transactions" />
            </div>
        )
    }

    return (
        <div className="mt-6 rounde-2xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Income vs Expenses (Last 6 Months)</h2>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                        <YAxis tickFormatter={(value) => `${currencySymbol}${value}`} tickLine={false} axisLine={false} className="text-xs" width={60} />
                        <Tooltip 
                            formatter={(value) => `${currencySymbol}${Number(value).toFixed(2)}`}
                            contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}