import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/types/transaction"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import { getNextDate } from "@/lib/recurring"
import { calculateIncome, calculateExpenses } from "@/lib/calculations"

type CalendarViewThings = {
    transactions: Transaction[]
    recurring: RecurringTransaction[]
    currencySymbol: string
}

export function CalendarView({ transactions, recurring, currencySymbol }: CalendarViewThings) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const startOfMonth = new Date(year, month, 1)

    const pastTransactions = useMemo(() => transactions.filter((transaction) => new Date(transaction.date) < startOfMonth), [transactions, startOfMonth])
    const startingBalance = calculateIncome(pastTransactions) - calculateExpenses(pastTransactions)

    const monthTransactions = useMemo(() => transactions.filter((transaction) => {
        const date = new Date(transaction.date)
        return (
            date.getMonth() === month && date.getFullYear() === year
        )
    }), [transactions, month, year])


    const projectedRecurring: Transaction[] = []
    const now = new Date()
    const isFutureMonth = year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth())

    if (isFutureMonth) {
        recurring.forEach((recurringTransaction) => {
            let nextDate = getNextDate(recurringTransaction)
            
            while (nextDate < new Date(year, month, 1)) {
                nextDate = getNextDate({ ...recurringTransaction, lastProcessedDate: nextDate.toISOString() })
            }

            while (nextDate.getMonth() === month && nextDate.getFullYear() === year) {
                if (nextDate > now) {
                    projectedRecurring.push({
                        id: `recurring-${recurringTransaction.id}-${nextDate.getTime()}`,
                        description: recurringTransaction.description,
                        amount: recurringTransaction.amount,
                        type: recurringTransaction.type,
                        category: recurringTransaction.category,
                        date: nextDate.toISOString(),
                    })
                }
                nextDate = getNextDate({ ...recurringTransaction, lastProcessedDate: nextDate.toISOString() })
            }
        })
    }
    const allMonthEvents = useMemo(() => [...monthTransactions, ...projectedRecurring], [monthTransactions, projectedRecurring])

    const { eventsByDay, balancesByDay } = useMemo(() => {
        const byDay: Record<number, Transaction[]> = {}
        let running = startingBalance

        allMonthEvents.forEach((transaction) => {
            const date = new Date(transaction.date).getDate()
            if (!byDay[date]) {
                byDay[date] = []
            }
            byDay[date].push(transaction)
        })

        const sortedBalances: Record<number, number> = {}

        const daysInMonth = new Date(year, month + 1, 0).getDate()
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = byDay[day] || []
            const dayIncome = calculateIncome(dayEvents)
            const dayExpenses = calculateExpenses(dayEvents)
            running += (dayIncome - dayExpenses)
            sortedBalances[day] = running
        }
        return {
            eventsByDay: byDay,
            balancesByDay: sortedBalances
        }
    }, [allMonthEvents, startingBalance, year, month])

    return (
        <div className="mt-6 rounded-2xl border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Cash flow calendar</h2>
                    <p className="text-xs text-muted-foreground">Starting balance: {currencySymbol}{startingBalance.toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex justify-center">
                <Calendar mode="single" selected={currentDate} onSelect={(date) => date && setCurrentDate(date)} month={currentDate} onMonthChange={setCurrentDate} className="w-full"
                    classNames={{
                        months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4 w-full",
                        head_row: "flex w-full",
                        head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1",
                        row: "flex w-full mt-2",
                        cell: "h-20 p-0 relative flex-1 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    } as any}
                    components={{
                        Day: (props: any) => {
                            const date = props.date || props.day?.date
                            if (!date) {
                                return null
                            }

                            const day = date.getDate()
                            const events = eventsByDay[day] || []
                            const balance = balancesByDay[day]
                            const isNegative = balance < 0

                            return (
                                <div {...props} className="h-24 w-full p-1 flex flex-col justify-between rounded-md text-left hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                    <span className="text-xs">{day}</span>

                                    <div className="flex gap-0.5 justify-center flex-wrap">
                                        {events.slice(0, 4).map((event) => (
                                            <span key={event.id} 
                                            className={cn("h-1.5 w-1.5 rounded-full", event.type === "income" ? "bg-green-500" : "bg-red-500")} />
                                        ))}
                                        {events.length > 4 && <div className="text-muted-foreground text-[8px]">+</div>}
                                    </div>

                                    <div className={cn("text-[10px] font-bold text-right", isNegative ? "text-red-600" : "text-muted-foreground")}>
                                        {balance !== undefined ? `${currencySymbol}${balance.toFixed(0)}` : ''}
                                    </div>
                                </div>
                            )
                        }
                    } as any}
                />
            </div>
        </div>
    )
}