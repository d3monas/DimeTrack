import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { EmptyState } from "../emptyState"
import { categoryCustomization } from "@/lib/categoryCustomization"
import { DEFAULT_CATEGORY_COLOR } from "@/lib/consts"

type SpendingChartThings = {
    totals: Record<string, number>
    categoryCustomization?: Record<string, categoryCustomization>
    currencySymbol: string
}

export function SpendingChart({ totals, categoryCustomization, currencySymbol }: SpendingChartThings) {
    const data = Object.entries(totals).map(([category, amount]) => ({ category, amount }))

    if (data.length === 0) {
        return (
            <div className="rounded-2xl border p-4 sm:p-6 mt-6">
                <h2 className="mb-4 text-xl font-semibold">Spending Breakdown</h2>
                <EmptyState message="Your spending breakdown will appear here as soon as you add some expenses" />
            </div>
        )
    }

    return (
        <div className="mt-6 rounded-2xl border p-4 sm:p-6">
            <h2 className="mb-4 text-xl font-semibold">Spending Breakdown</h2>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="amount" nameKey="category" outerRadius={100}>
                            {data.map((entry, index) => {
                                const color = categoryCustomization?.[entry.category]?.color || DEFAULT_CATEGORY_COLOR
                                return (
                                    <Cell key={`cell-${index}`} fill={color} />
                                )
                            })}
                        </Pie>
                        <Tooltip formatter={(value, name) => [
                            `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            name
                        ]}
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
                        }} />
                        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}