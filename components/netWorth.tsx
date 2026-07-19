import { Minus, TrendingDown, TrendingUp } from "lucide-react"

type NetWorthThings = {
  currentBalance: number
  previousBalance: number
  currencySymbol: string
}

export function NetWorthSnapshot({ currentBalance, previousBalance, currencySymbol }: NetWorthThings) {
  const difference = currentBalance - previousBalance
  const isUp = difference > 0

  return (
    <div className="rounded-2xl border p-4 sm:p-6 flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">Net Worth (All Time)</p>
      <h2 className="text-3xl font-bold sm:text-4xl">{currencySymbol}{currentBalance.toFixed(2)}</h2>

      {difference === 0 ? (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <Minus className="h-4 w-4" />
          <span>No change from last month</span>
        </div>
      ) : (
        <div className={`flex items-center gap-1 text-sm font-medium mt-1 ${isUp ? "text-green-600" : "text-red-600"}`}>
          {isUp ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>{isUp ? "+" : "-"}{currencySymbol}{Math.abs(difference).toFixed(2)}</span>
          <span className="text-muted-foreground font-normal">from last month</span>
        </div>
      )}
    </div>
  )
}