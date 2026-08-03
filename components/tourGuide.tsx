import { CheckCircle2, X } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

type TourGuideThings = {
    step: number
    setStep: (step: number) => void
    activeTab: string
    isAddDialogOpen: boolean
    isGoalDialogOpen: boolean
    transactionCount: number
    goalsCount: number
    onFinishTour: () => void
    onSkip: () => void
}

const steps = [
    {
        title: "1. Log a Transaction",
        description: "Welcome to the demo! Let's start by tracking some money. Click on the 'Transactions' tab above.",
        targetTab: "transactions",
        requiresAction: "tab"
    },
    {
        title: "2. Add Your Own",
        description: "Now, click the 'Add Transaction' button on the right side of the screen.",
        targetTab: "transactions",
        requiresAction: "dialog"
    },
    {
        title: "3. Fill & Save",
        description: "Fill out the details (Description, Amount, Category) and click 'Save Transaction'.",
        targetTab: "transactions",
        requiresAction: "saveTrans"
    },
    {
        title: "4. Set a Goal",
        description: "Great job! Now let's set a savings goal. Click on the 'Budgets & Goals' tab.",
        targetTab: "budgets",
        requiresAction: "tab"
    },
    {
        title: "5. Create a Goal",
        description: "Click the 'Create goal' button to set up a new savings target.",
        targetTab: "budgets",
        requiresAction: "goalDialog"
    },
    {
        title: "6. Save Your Goal",
        description: "Name your goal, enter a target amount, and click 'Create'.",
        targetTab: "budgets",
        requiresAction: "saveGoal"
    },
    {
        title: "7. View the Overview",
        description: "You've got transactions and goals. Click the 'Overview' tab to see your data visualized in the charts.",
        targetTab: "overview",
        requiresAction: "tab"
    },
    {
        title: "8. You're Ready!",
        description: "Explore the Calendar and Subscriptions tabs. When you're ready to use your own real data, click 'Finish Tour & Start Fresh' below.",
        targetTab: "overview",
        requiresAction: "finish"
    }
]

export function TourGuide({ step, setStep, activeTab, isAddDialogOpen, isGoalDialogOpen, transactionCount, goalsCount, onFinishTour, onSkip }: TourGuideThings) {
    const prevCount = useRef(transactionCount)
    const prevGoalCount = useRef(goalsCount)

    useEffect(() => {
        const currentStep = steps[step]
        if (!currentStep) return

        if (currentStep.requiresAction === "tab" && activeTab === currentStep.targetTab) {
            const timer = setTimeout(() => setStep(step + 1), 500)
            return () => clearTimeout(timer)
        }

        if (currentStep.requiresAction === "dialog" && isAddDialogOpen) {
            setStep(step + 1)
        }

        if (currentStep.requiresAction === "saveTrans" && !isAddDialogOpen && transactionCount > prevCount.current) {
            setStep(step + 1)
        }

        if (currentStep.requiresAction === "goalDialog" && isGoalDialogOpen) {
            setStep(step + 1)
        }

        if (currentStep.requiresAction === "saveGoal" && !isGoalDialogOpen && goalsCount > prevGoalCount.current) {
            setStep(step + 1)
        }

        if (transactionCount !== prevCount.current) prevCount.current = transactionCount
        if (goalsCount !== prevGoalCount.current) prevGoalCount.current = goalsCount

    }, [step, activeTab, isAddDialogOpen, isGoalDialogOpen, transactionCount, goalsCount, setStep])

    if (step > 7) {
        return null
    }

    const currentStep = steps[step]

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-100 w-full max-w-md px-4">
            <div className="rounded-xl border bg-card shadow-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                            {step + 1}
                        </span>
                        <h3 className="font-semibold">{currentStep.title}</h3>
                    </div>
                    <button onClick={onSkip} className="text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <p className="text-sm text-muted-foreground">{currentStep.description}</p>

                <div className="flex gap-1">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    {currentStep.requiresAction === "finish" ? (
                        <Button className="w-full" onClick={onFinishTour}>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Finish Tour & Start Fresh
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="w-full" onClick={onSkip}>Skip Tour</Button>
                    )}
                </div>
            </div>
        </div>
    )
}