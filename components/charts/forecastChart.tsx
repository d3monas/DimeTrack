import { ForecastPoint } from "@/lib/calculations/calculations"
import { EmptyState } from "../emptyState"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts"
import { chartTooltipStyle, formatYAxis } from "@/lib/chartStyles"
import { TRENDCHART_EXPENSES_COLOR } from "@/lib/consts"

type ForecastChartThings = {
  data: ForecastPoint[]
  currencySymbol: string
}

export function ForecastChart({ data, currencySymbol }: ForecastChartThings) {
  const hasRecurring = data.length > 0

  if (!hasRecurring) {
    return (
      <div className="rounded-2xl border p-4 sm:p-6 mt-6">
        <h2 className="mb-4 text-xl font-semibold">12-Month Cash Flow Forecast</h2>
        <EmptyState message="Add active recurring transactions to see your 12-month projected balance" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border p-4 sm:p-6 mt-6">
      <h2 className="mb-1 text-xl font-semibold">12-Month Cash Flow Forecast</h2>
      <p className="text-sm text-muted-foreground mb-4">Projected balance based on your active recurring income and expenses</p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} fill="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={(value) => formatYAxis(Number(value), currencySymbol)} tickLine={false} axisLine={false} fontSize={12} width={70} fill="hsl(var(--muted-foreground))" />
            <Tooltip
              formatter={(value) => `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              {...chartTooltipStyle}
            />
            <ReferenceLine y={0} stroke={TRENDCHART_EXPENSES_COLOR} strokeWidth={2} strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8b5cf6" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}