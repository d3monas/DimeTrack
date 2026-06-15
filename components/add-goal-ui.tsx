import { useState, useEffect } from "react"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import type { Goal } from "@/types/goal"
import { FieldError } from "@/components/fieldError"

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
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            setName(goal?.name ?? "")
            setSaved(goal?.currentAmount.toString() ?? "")
            setTarget(goal?.targetAmount.toString() ?? "")
            setErrors({})
        }
    }, [open, goal])

    function validate() {
        const newErrors: Record<string, string> = {}
        const parsedSaved = Number(saved)
        const parsedTarget = Number(target)
        if (!name.trim()) {
            newErrors.name = "Name is required"
        }
        if (!saved || Number.isNaN(parsedSaved)) {
            newErrors.saved = "Please enter a valid current amount"
        } else if (parsedSaved < 0) {
            newErrors.saved = "Current amount cannot be negative"
        }
        if (!target || Number.isNaN(parsedTarget)) {
            newErrors.target = "Please enter a valid target amount"
        } else if (parsedTarget <= 0) {
            newErrors.target = "Target amount must be greater than 0"
        }
        setErrors(newErrors)
        return (
            Object.keys(newErrors).length === 0
        )
    }

    function handleSave() {
        if (validate()) {
            onSave(name, Number(saved), Number(target))
            setOpen(false)
        }
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
                            <Input value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }} />
                            <FieldError message={errors.name} />
                        </div>
        
                        <div>
                            <Label>Currently saved</Label>
                            <Input type="number" min="0" step="0.01" value={saved} onChange={(e) => { setSaved(e.target.value); 
                                if (errors.saved) setErrors((p) => ({ ...p, saved: "" })) }} placeholder="0.00" />
                            <FieldError message={errors.saved} />
                        </div>
        
                        <div>
                            <Label>Target Amount</Label>
                            <Input type="number" min="0.01" step="0.01" value={target} onChange={(e) => { setTarget(e.target.value); 
                                if (errors.target) setErrors((p) => ({ ...p, target: "" })) }} placeholder="1000.00" />
                            <FieldError message={errors.target} />
                        </div>
        
        
                        <Button className="w-full" onClick={handleSave}>{goal ? "Save":"Create"}</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
}

