import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { LayoutDashboard, CalendarDays, Target, Database } from "lucide-react"

type TutorialDialogThings = {
  open: boolean
  onClose: () => void
  onLoadSampleData: () => void
}

export function TutorialDialog({ open, onClose, onLoadSampleData }: TutorialDialogThings) {
  const [step, setStep] = useState(0)
  const [loadSampleOnFinish, setLoadSampleOnFinish] = useState(false)

  const handleClose = () => {
    setStep(0)
    setLoadSampleOnFinish(false)
    onClose()
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      if (loadSampleOnFinish) {
        onLoadSampleData()
      }
      handleClose()
    }
  }

  const handleLoadSampleStart = () => {
    setLoadSampleOnFinish(true)
    setStep(1)
  }

  const steps = [
    {
      icon: Database,
      title: "Welcome to DimeTrack! 👋",
      description: "DimeTrack is a 100% private, offline budgeting app. Your data never leaves your device. Would you like to start with some sample data to see how everything works, or start completely fresh?",
      actions: (
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1" onClick={handleClose}>Start Fresh</Button>
          <Button className="flex-1" onClick={handleLoadSampleStart}>Load Sample Data</Button>
        </div>
      )
    },
    {
      icon: LayoutDashboard,
      title: "The Overview Tab",
      description: "Track your Net Worth over time, view a 12-month cash flow forecast based on your recurring bills, and see smart stats like your daily average spending.",
      actions: <Button className="w-full" onClick={handleNext}>Next</Button>
    },
    {
      icon: CalendarDays,
      title: "The Calendar Tab",
      description: "The calendar projects your future recurring transactions and calculates your running daily balance. If a future date turns red, you are projected to overdraft.",
      actions: <Button className="w-full" onClick={handleNext}>Next</Button>
    },
    {
      icon: Target,
      title: "Budgets & Goals",
      description: "Category limits now support 1-month rollover-underspend this month, and your available balance increases next month! Set savings goals with target dates to stay on track.",
      actions: <Button className="w-full" onClick={handleNext}>Finish Tutorial</Button>
    }
  ]

  const CurrentStep = steps[step]
  const Icon = CurrentStep.icon

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{CurrentStep.title}</DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground pt-2 min-h-15">
            {CurrentStep.description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {CurrentStep.actions}
        </div>
        <div className="flex justify-center gap-1 mt-4">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}