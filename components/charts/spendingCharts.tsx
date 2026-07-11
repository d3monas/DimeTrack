import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
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
                        <Pie data={data} dataKey="amount" nameKey="category" outerRadius={100} label={({ payload }) => payload.category}>
                            {data.map((entry, index) => {
                                const color = categoryCustomization?.[entry.category]?.color || DEFAULT_CATEGORY_COLOR
                                return (
                                    <Cell key={`cell-${index}`} fill={color} />
                                )
                            })}
                        </Pie>
                        <Tooltip formatter={(value) => `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}