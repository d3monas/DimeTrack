import { useState} from "react";
import { Button } from "./ui/button";
import type { Goal } from "@/types/goal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

type GoalCardThings = {
    goal: Goal | null
    progress: number
    remaining: number
    onEdit: () => void
    onContribute: (amount: number) => void
}

export function GoalCard({ goal, progress, remaining, onEdit, onContribute }: GoalCardThings) {

    const [contributeOpen, setContributeOpen] = useState(false)
    const [contributeAmount, setContributeAmount] = useState("")

    function handleContribute() {
        const parsed = Number(contributeAmount)
        if (!contributeAmount || Number.isNaN(parsed) || parsed <= 0) {
            return
        }
        onContribute(parsed)
        setContributeAmount("")
        setContributeOpen(false)
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
                    <p className="font-bold">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</p>
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

            <p className="mt-2 text-sm text-muted-foreground">{remaining <= 0 ? "🥳 You reached your goal!" : `$${remaining.toFixed(2)} remaining`}</p>

            <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Contribute to {goal.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Amount</Label>
                            <Input type="number" min="0.01" step="0.01" placeholder="0.00" value={contributeAmount} onChange={(e) => setContributeAmount(e.target.value)} />
                        </div>
                        <Button className="w-full" onClick={handleContribute}>Confirm</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}