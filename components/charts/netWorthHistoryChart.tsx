import { NetWorthHistoryPoint } from "@/lib/calculations"
import { EmptyState } from "../emptyState"
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts"
import { chartTooltipStyle } from "@/lib/chartStyles"

type NetWorthHistoryChartThings = {
  data: NetWorthHistoryPoint[]
  currencySymbol: string
}

export function NetWorthHistoryChart({ data, currencySymbol }: NetWorthHistoryChartThings) {
  const hasData = data.some(d => d.balance !== 0)

  if (!hasData) {
    return (
      <div className="rounded-2xl border p-4 sm:p-6 mt-6">
        <h2 className="mb-4 text-xl font-semibold">Net Worth History</h2>
        <EmptyState message="Your net worth history will appear here once you add transactions" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border p-4 sm:p-6 mt-6">
      <h2 className="mb-4 text-xl font-semibold">Net Worth History (6 Months)</h2>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--privary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} fill="hsl(var(--muted-foreground))" />
            <YAxis tickFormatter={(value) => `${currencySymbol}${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
              tickLine={false} axisLine={false} fontSize={12} width={60} fill="hsl(var(--muted-foreground))"
            />
            <Tooltip formatter={(value) => `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            {...chartTooltipStyle} 
            />
            <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}