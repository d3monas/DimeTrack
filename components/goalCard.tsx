import { Button } from "./ui/button";
import type { Goal } from "@/types/goal";

type GoalCardThings = {
    goal: Goal | null
    progress: number
    remaining: number
    onEdit: () => void
}

export function GoalCard({
    goal, progress, remaining, onEdit,
}: GoalCardThings) {

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
            <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold">{goal.name}</h2>
                    <p className="text-muted-foreground">Savings Goal</p>
                </div>

                <p className="font-bold">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-green-600"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-2 text-sm text-muted-foreground">${remaining.toFixed(2)} remaining</p>
        </div>
    )
}