import { useState } from "react";
import { Button } from "./ui/button";
import type { Goal } from "@/types/goal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { FieldError } from "./fieldError"

type GoalCardThings = {
    goal: Goal | null
    progress: number
    remaining: number
    onEdit: () => void
    onContribute: (amount: number) => void
    currencySymbol: string
}

export function GoalCard({ goal, progress, remaining, onEdit, onContribute, currencySymbol }: GoalCardThings) {

    const [contributeOpen, setContributeOpen] = useState(false)
    const [contributeAmount, setContributeAmount] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

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
            <div className="mt-6 rounded-2xl border p-6">
                <h2 className="text-xl font-semibold">Savings Goal</h2>
                <Button size="lg" variant="default" onClick={onEdit} className="mt-4">Create goal</Button>
            </div>
        )
    }

    return (
        <div className="mt-6 rounded-2xl border p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">{goal.name}</h2>
                    <p className="text-muted-foreground">Savings Goal</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="font-bold">{currencySymbol}{goal.currentAmount.toFixed(2)} / {currencySymbol}{goal.targetAmount.toFixed(2)}</p>
                    <Button size="sm" variant="outline" onClick={() => setContributeOpen(true)}>Contribute to goal</Button>
                    <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>
                </div>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{remaining <= 0 ? "🥳 You reached your goal!" : `${currencySymbol}${remaining.toFixed(2)} remaining`}</p>

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