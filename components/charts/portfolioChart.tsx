import { PortfolioHistory } from "@/lib/calculations/investmentCalculations"
import { EmptyState } from "../emptyState"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { chartTooltipStyle, formatYAxis } from "@/lib/chartStyles"

type PortfolioChartThings = {
  data: PortfolioHistory[]
  currencySymbol: string
}

export function PortfolioChart({ data, currencySymbol }: PortfolioChartThings) {
  const hasData = data.length > 0

  if (!hasData) {
    return (
      <div className="rounded-2xl border p-4 sm:p-6 mt-6">
        <h2 className="mb-4 text-xl font-semibold">Portfolio Performance</h2>
        <EmptyState message="Your portfolio chart will appear here as you log buy, sell, or update transactions" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border p-4 sm:p-6 mt-6">
      <h2 className="mb-1 text-xl font-semibold">Portfolio Performance</h2>
      <p className="text-sm text-muted-foreground mb-4">Tracking your invested capital vs total market value over time</p>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} fill="hsl(var(--muted-foreground))" />
            <YAxis 
              tickFormatter={(value) => formatYAxis(Number(value), currencySymbol)} 
              tickLine={false} 
              axisLine={false} 
              fontSize={12} 
              width={70} 
              fill="hsl(var(--muted-foreground))" 
            />
            <Tooltip
              formatter={(value, name) => [
                `${currencySymbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                name === "value" ? "Portfolio Value" : "Total Invested"
              ]}
              {...chartTooltipStyle}
            />
            <Area type="monotone" dataKey="cost" stroke="#6b7280" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
            <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}