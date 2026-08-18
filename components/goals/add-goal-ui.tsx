import { useState, useEffect } from "react"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import type { Goal } from "@/types/goal"
import { FieldError } from "@/components/fieldError"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "../ui/calendar"

type GoalDialogThings = {
    open: boolean
    setOpen: (open: boolean) => void
    goal: Goal | null
    onSave: (id: string | null, name: string, currentAmount: number, targetAmount: number, targetDate?: string) => void
}

export function GoalDialog({ open, setOpen, goal, onSave }: GoalDialogThings) {
    const [name, setName] = useState("")
    const [saved, setSaved] = useState("")
    const [target, setTarget] = useState("")
    const [targetDate, setTargetDate] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            setName(goal?.name ?? "")
            setSaved(goal?.currentAmount.toString() ?? "")
            setTarget(goal?.targetAmount.toString() ?? "")
            setTargetDate(goal?.targetDate ? goal.targetDate.split("T")[0]: "")
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
        if (targetDate && new Date(targetDate) <= new Date()) {
            newErrors.targetDate = "Target date must be in the future"
        }
        setErrors(newErrors)
        return (
            Object.keys(newErrors).length === 0
        )
    }

    function handleSave() {
        if (validate()) {
            onSave(goal?.id ?? null, name, Number(saved), Number(target), targetDate || undefined)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{goal ? "Edit Goal" : "Create Goal"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }} />
                        <FieldError message={errors.name} />
                    </div>

                    <div>
                        <Label>Currently saved</Label>
                        <Input type="number" min="0" step="0.01" value={saved} onChange={(e) => {
                            setSaved(e.target.value);
                            if (errors.saved) setErrors((p) => ({ ...p, saved: "" }))
                        }} placeholder="0.00" />
                        <FieldError message={errors.saved} />
                    </div>

                    <div>
                        <Label>Target Amount</Label>
                        <Input type="number" min="0.01" step="0.01" value={target} onChange={(e) => {
                            setTarget(e.target.value);
                            if (errors.target) setErrors((p) => ({ ...p, target: "" }))
                        }} placeholder="1000.00" />
                        <FieldError message={errors.target} />
                    </div>

                    <div>
                        <Label>Target Date (optional)</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {targetDate ? format(new Date(targetDate), "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={targetDate ? new Date(targetDate) : undefined}
                                    onSelect={(d) => {
                                        setTargetDate(d ? d.toISOString().split("T")[0] : "")
                                        if (errors.targetDate) setErrors((p) => ({ ...p, targetDate: "" }))
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <FieldError message={errors.targetDate} />
                    </div>


                    <Button className="w-full" onClick={handleSave}>{goal ? "Save" : "Create"}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

