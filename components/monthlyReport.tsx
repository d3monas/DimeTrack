import { MonthlyReportData } from "@/lib/calculations";
import { useState } from "react";
import { Button } from "./ui/button"
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FileBarChart, TrendingDown, TrendingUp, Wallet, Tag, ShoppingBag } from "lucide-react";

type MonthlyReportThings = {
  data: MonthlyReportData
  currencySymbol: string
}

export function MonthlyReport({ data, currencySymbol }: MonthlyReportThings) {
  const [open, setOpen] = useState(false)
  const now = new Date()
  const monthName = now.toLocaleDateString("default", { month: "long" })

  const expenseDiffIsUp = data.expenseDiff > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 sm:w-auto">
          <FileBarChart className="h-4 w-4" />
          <span className="hidden sm:inline">View Monthly Report</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{monthName} Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium">Income</span>
              </div>
              <p className="text-lg font-bold text-green-600 mt-1">{currencySymbol}{data.income.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium">Expenses</span>
              </div>
              <p className="text-lg font-bold text-red-600 mt-1">{currencySymbol}{data.expenses.toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-lg border p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Net Savings</p>
              <p className="text-lg font-bold">{currencySymbol}{data.savings.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Savings Rate</p>
              <p className="text-lg font-bold">{data.savingsRate.toFixed(1)}%</p>
            </div>
          </div>

          {data.prevExpenses > 0 && (
            <div className="rounded-lg border p-3 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expenses vs Last Month</span>
              <span className={`text-sm font-medium flex items-center gap-1 ${expenseDiffIsUp ? "text-red-600" : "text-green-600"}`}>
                {expenseDiffIsUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {expenseDiffIsUp ? "+" : "-"}{currencySymbol}{Math.abs(data.expenseDiff).toFixed(2)}
              </span>
            </div>
          )}

          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-2"><Wallet className="w-4 h-4" />Daily Average</span>
              <span className="font-medium">{currencySymbol}{data.dailyAverage.toFixed(2)}</span>
            </div>

            {data.topCategory && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2 shrink-0"><Tag className="w-4 h-4" />Top Category</span>
                <span className="font-medium text-right wrap-break-word">{data.topCategory.name} ({currencySymbol}{data.topCategory.amount.toFixed(2)})</span>
              </div>
            )}

            {data.largestPurchase && (
              <div className="flex justify-between items-center text-sm gap-2">
                <span className="text-muted-foreground flex items-center gap-2 shrink-0"><ShoppingBag className="w-4 h-4" />Largest Purchase</span>
                <span className="font-medium text-right wrap-break-word">{data.largestPurchase.description} ({currencySymbol}{data.largestPurchase.amount.toFixed(2)})</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}