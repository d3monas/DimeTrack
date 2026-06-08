import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

type GoalDialogThings = {
    open: boolean
    setOpen: (open: boolean) => void
    goalName: string
    setGoalName: (value: string) => void
    goalSaved: string
    setGoalSaved: (value: string) => void
    goalTarget: string
    setGoalTarget: (value: string) => void
    
    onSave: () => void
}

export function GoalDialog({ open, setOpen, goalName, setGoalName, goalSaved, setGoalSaved, goalTarget, setGoalTarget, onSave }: GoalDialogThings) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={goalName} onChange={(e) => setGoalName(e.target.value)} />
                    </div>

                    <div>
                        <Label>Currently saved</Label>
                        <Input type="number" min="0" step="0.01" value={goalSaved} onChange={(e) => setGoalSaved(e.target.value)} />
                    </div>

                    <div>
                        <Label>Target Amount</Label>
                        <Input type="number" min="0.01" step="0.01" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} />
                    </div>


                    <Button className="w-full" onClick={onSave}>Save Goal</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}