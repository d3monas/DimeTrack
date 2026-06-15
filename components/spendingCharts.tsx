import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

type Things = {
    totals: Record<string, number>
}

const colors = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
]

export function SpendingChart({ totals }: Things) {
    const data = Object.entries(totals).map(([category, amount]) => ({ category, amount }))

    if (data.length === 0) {
        return (
            <div className="rounded-2xl border p-6 mt-6">
                <h2 className="mb-4 text-xl font-semibold">Spending Breakdown</h2>
                <p className="text-muted-foreground">Add some expenses to see spending trends</p>
            </div>
        )
    }

    return (
        <div className="mt-6 rounded-2xl border p-6">
            <h2 className="mb-4 text-xl font-semibold">Spending Breakdown</h2>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="amount" nameKey="category" outerRadius={100} label={({ payload }) => payload.category}>{data.map((_, index) => (<Cell key={index} fill={colors[index % colors.length]} />))}</Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}