import { MonthlyReportData } from "@/lib/calculations";
import { useState } from "react";
import { Button } from "./ui/button"
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { FileBarChart } from "lucide-react";

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
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <FileBarChart className="h-4 w-4" />
          View Monthly Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{monthName} Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          
        </div>

      </DialogContent>
    </Dialog>
  )
}