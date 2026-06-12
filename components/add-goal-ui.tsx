import { useState, useEffect } from "react"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import type { Goal } from "@/types/goal"

type GoalDialogThings = {
    open: boolean
    setOpen: (open: boolean) => void
    goal: Goal | null
    onSave: (name: string, currentAmount: number, targetAmount: number) => void
}

export function GoalDialog({ open, setOpen, goal, onSave }: GoalDialogThings) {
    const [name, setName] = useState("")
    const [saved, setSaved] = useState("")
    const [target, setTarget] = useState("")

    useEffect(() => {
        if (open) {
            setName(goal?.name ?? "")
            setSaved(goal?.currentAmount.toString() ?? "")
            setTarget(goal?.targetAmount.toString() ?? "")
        }
    }, [open, goal])

    function handleSave() {
        const parsedSaved = Number(saved)
        const parsedTarget = Number(target)

        if (!name || Number.isNaN(parsedSaved) || Number.isNaN(parsedTarget) || parsedTarget <= 0 || parsedSaved < 0) {
            return
        }
        onSave(name, parsedSaved, parsedTarget)
        setOpen(false)
    }

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{goal ? "Edit Goal":"Create Goal"}</DialogTitle>
                    </DialogHeader>
        
                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
        
                        <div>
                            <Label>Currently saved</Label>
                            <Input type="number" min="0" step="0.01" value={saved} onChange={(e) => setSaved(e.target.value)} placeholder="0.00" />
                        </div>
        
                        <div>
                            <Label>Target Amount</Label>
                            <Input type="number" min="0.01" step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="1000.00" />
                        </div>
        
        
                        <Button className="w-full" onClick={handleSave}>{goal ? "Save":"Create"}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
}

