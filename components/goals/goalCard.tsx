import { useState } from "react";
import { Button } from "../ui/button";
import type { Goal } from "@/types/goal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FieldError } from "../fieldError"
import type { Transaction } from "@/types/transaction"
import { defaultSavingsCategory } from "@/lib/consts"
import { PaginationUI } from "../paginationUI"
import { pagination } from "@/lib/pagination"
import { EmptyState } from "../emptyState"

type GoalCardThings = {
    goal: Goal | null
    progress: number
    remaining: number
    onEdit: () => void
    onContribute: (amount: number) => void
    currencySymbol: string
    transactions: Transaction[]
}

const contributionsPerPage = 3

export function GoalCard({ goal, progress, remaining, onEdit, onContribute, currencySymbol, transactions }: GoalCardThings) {

    const [contributeOpen, setContributeOpen] = useState(false)
    const [contributeAmount, setContributeAmount] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    
    const contributions = transactions.filter((transaction) => transaction.category === defaultSavingsCategory)
    
    // sorting algo from oldest to newest to calculate correctly
    const chronological = [...contributions].sort(
        (a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    let runningTotal = 0
    const withRunningTotal = chronological.map((transaction) => {
        runningTotal += transaction.amount
        return {
            ...transaction, runningTotal
        }
    })
    const newestFirst = [...withRunningTotal].reverse()
    const { pageItems, currentPage, totalPages, nextPage, prevPage } = pagination(newestFirst, contributionsPerPage)


    function handleContribute() {
        const newErrors: Record<string, string> = {}
        const parsed = Number(contributeAmount)
        if (!contributeAmount || Number.isNaN(parsed) || parsed <= 0) {
            newErrors.amount = "Please enter a valid amount"
        }
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) {
            return
        }

        onContribute(parsed)
        setContributeAmount("")
        setContributeOpen(false)
        setErrors({})
    }

    if (!goal) {
        return (
            <div className="mt-6 rounded-2xl border p-4 sm:p-6">
                <h2 className="text-xl font-semibold">Savings Goal</h2>
                <EmptyState message="You haven't set a savings goal yet. Create one to start tracking progress" />
                <Button size="lg" variant="default" onClick={onEdit} className="mt-4">Create goal</Button>
            </div>
        )
    }

    return (
        <div className="mt-6 rounded-2xl border p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold">{goal.name}</h2>
                    <p className="text-muted-foreground">Savings Goal</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <p className="font-bold">{currencySymbol}{goal.currentAmount.toFixed(2)} / {currencySymbol}{goal.targetAmount.toFixed(2)}</p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setContributeOpen(true)}>Contribute to goal</Button>
                        <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>
                    </div>
                </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-green-600 transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{remaining <= 0 ? "🥳 You reached your goal!" : `${currencySymbol}${remaining.toFixed(2)} remaining`}</p>

            {newestFirst.length > 0 && (
                <div className="mt-4 border-t pt-4">
                    <p className="mb-2 text-sm font-medium">Contribution History</p>
                    <div className="space-y-2">
                        {pageItems.map((transaction) => (
                            <div key={transaction.id} className="flex flex-wrap gap-2 items-center justify-between rounded-md border p-2">
                                <div>
                                    <p className="text-sm">{new Date(transaction.date).toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Total: {currencySymbol}{transaction.runningTotal.toFixed(2)}</p>
                                </div>
                                <span className="text-sm font-medium text-green-600">+{currencySymbol}{transaction.amount.toFixed(2)}</span>
                            </div> 
                        ))}
                    </div>
                    <PaginationUI currentPage={currentPage} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} />
                </div>
            )}

            <Dialog open={contributeOpen} onOpenChange={(value) => { setContributeOpen(value)
                if (!value) { setContributeAmount(""); setErrors({}) } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contribute to {goal.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Amount</Label>
                            <Input type="number" min="0.01" step="0.01" placeholder="0.00" value={contributeAmount} onChange={(e) => {
                                setContributeAmount(e.target.value)
                                if (errors.amount) setErrors({})}} />
                            <FieldError message={errors.amount} />
                        </div>
                        <Button className="w-full" onClick={handleContribute}>Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}