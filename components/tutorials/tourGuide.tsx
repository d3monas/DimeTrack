import { CheckCircle2, X } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

type TourGuideThings = {
    step: number
    setStep: (step: number) => void
    activeTab: string
    isAddDialogOpen: boolean
    isGoalDialogOpen: boolean
    isSettingsOpen: boolean
    transactionCount: number
    goalsCount: number
    categoriesCount: number
    rulesCount: number
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
        title: "4. Open Settings",
        description: "Great job! Now let's customize your experience. Click the 'Settings' button in the top right corner.",
        requiresAction: "openSettings"
    },
    {
        title: "5. Add a Category",
        description: "Make sure you're on the 'General' tab. Type a name for a new category (e.g., 'Hobbies') and click 'Add'.",
        requiresAction: "saveCat"
    },
    {
        title: "6. Add an Auto-Rule",
        description: "Switch to the 'Automation' tab inside Settings. Create a rule (e.g., If contains 'Uber', set to 'Transport') and click 'Add Rule'.",
        requiresAction: "saveRule"
    },
    {
        title: "7. Close Settings",
        description: "You can close the Settings dialog now to continue the tour.",
        requiresAction: "closeSettings"
    },
    {
        title: "8. Set a Goal",
        description: "Now let's set a savings goal. Click on the 'Budgets & Goals' tab above.",
        targetTab: "budgets",
        requiresAction: "tab"
    },
    {
        title: "9. Create a Goal",
        description: "Click the 'New Goal' button to set up a new savings target.",
        targetTab: "budgets",
        requiresAction: "goalDialog"
    },
    {
        title: "10. Save Your Goal",
        description: "Name your goal, enter a target amount, and click 'Create'.",
        targetTab: "budgets",
        requiresAction: "saveGoal"
    },
    {
        title: "11. Check Your Investments",
        description: "We've added a sample stock portfolio for you! Click on the 'Investments' tab to see how Buy/Sell work.",
        targetTab: "investments",
        requiresAction: "tab"
    },
    {
        title: "12. You're Ready!",
        description: "Explore the Calendar and Subscriptions tabs. When you're ready to use your own real data, click 'Finish Tour & Start Fresh' below.",
        targetTab: "overview",
        requiresAction: "finish"
    }
]

export function TourGuide({ step, setStep, activeTab, isAddDialogOpen, isGoalDialogOpen, isSettingsOpen, transactionCount, goalsCount, categoriesCount, rulesCount, onFinishTour, onSkip }: TourGuideThings) {
    const prevCount = useRef(transactionCount)
    const prevGoalCount = useRef(goalsCount)
    const prevCatCount = useRef(categoriesCount)
    const prevRuleCount = useRef(rulesCount)

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

        if (currentStep.requiresAction === "openSettings" && isSettingsOpen) {
            setStep(step + 1)
        }

        if (currentStep.requiresAction === "saveCat" && categoriesCount > prevCatCount.current) {
            setStep(step + 1)
        }

        if (currentStep.requiresAction === "saveRule" && rulesCount > prevRuleCount.current) {
            setStep(step + 1)
        }

        if (currentStep.requiresAction === "closeSettings" && !isSettingsOpen) {
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
        if (categoriesCount !== prevCatCount.current) prevCatCount.current = categoriesCount
        if (rulesCount !== prevRuleCount.current) prevRuleCount.current = rulesCount

    }, [step, activeTab, isAddDialogOpen, isGoalDialogOpen, isSettingsOpen, transactionCount, goalsCount, categoriesCount, rulesCount, setStep])

    if (step > 11) {
        return null
    }

    const currentStep = steps[step]

    const isDialogOpen = isAddDialogOpen || isGoalDialogOpen

    return (
        <div className={cn(
            "fixed z-100 w-[calc(100%-1rem)] max-w-70 sm:max-w-xs transition-all duration-300",
            isDialogOpen
                ? "top-4 left-1/2 -translate-x-1/2"
                : "bottom-4 left-1/2 -translate-x-1/2",
            "sm:top-auto sm:bottom-4 sm:left-auto sm:right-4 sm:translate-x-0"
        )}>
            <div className="rounded-xl border bg-card shadow-2xl p-2 sm:p-3 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                            {step + 1}
                        </span>
                        <h3 className="font-semibold text-sm">{currentStep.title}</h3>
                    </div>
                    <button onClick={onSkip} className="text-muted-foreground hover:text-foreground mt-0.5">
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>

                <p className="text-muted-foreground leading-relaxed">{currentStep.description}</p>

                <div className="flex gap-1">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-primary" : "bg-muted")}
                        />
                    ))}
                </div>

                <div className="flex gap-2 pt-1">
                    {currentStep.requiresAction === "finish" ? (
                        <Button size="sm" className="w-full text-xs h-8" onClick={onFinishTour}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Finish & Start Fresh
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={onSkip}>Skip Tour</Button>
                    )}
                </div>
            </div>
        </div>
    )
}