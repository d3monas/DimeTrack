"use client"
// components
import { useState, useEffect, useRef } from "react"
import { TransactionList } from "@/components/recentTransactions/transactionList"
import { GoalDialog } from "@/components/goals/add-goal-ui"
import { AddTransactionDialog } from "@/components/recentTransactions/add-transaction-ui"
import { CategoryBreakdown } from "@/components/categoryBreakdown"
import { SpendingChart } from "@/components/charts/spendingCharts"
import { BudgetOverview } from "@/components/budgetOverview"
import { SettingsDialog } from "@/components/settings/settingsUI"
import { EditTransactionDialog } from "@/components/recentTransactions/edit-transaction-ui"
import { ThemeToggle } from "@/components/theme-provider"
import { LoadingSkeleton } from "@/components/loadingSkeleton"
import { GoalsSelection } from "@/components/goals/goalsSelection"
import { TrendChart } from "@/components/charts/trendChart"
import { UpcomingTransactions } from "@/components/upcomingTransactions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { CashFlowTimeline } from "@/components/cashFlowTimeline"
import { AccountBalances } from "@/components/accountBalances"
import { SmartStats } from "@/components/smartStats"
import { NetWorth } from "@/components/netWorth"
import { Onboarding } from "@/components/tutorials/onboarding"
import { Button } from "@/components/ui/button"
import { NetWorthHistoryChart } from "@/components/charts/netWorthHistoryChart"
import { MonthlyReport } from "@/components/monthlyReport"
import { Subscriptions } from "@/components/subscriptions"
import { CommandPalette } from "@/components/commandPalette"
import { ForecastChart } from "@/components/charts/forecastChart"
import { TutorialDialog } from "@/components/tutorials/tutorial"
import { Investments } from "@/components/investments"
import { AchievementsDialog } from "@/components/achievements"

// types
import type { Transaction, TransactionSplit } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { FilterPeriod } from "@/lib/calculations/calculations"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Rule } from "@/types/rule"
import type { Account } from "@/types/account"
import type { Asset, InvestmentTransaction, InvestmentType } from "@/types/asset"
import type { DashboardVisibility } from "@/types/dashboard"

// libs
import { calculateIncome, calculateExpenses, filterTransactionsByPeriod, getMonthlyTrends } from "@/lib/calculations/calculations"
import {
  saveTransactions, saveCategories, saveBudgets, saveCurrency, loadAllData, saveRecurring,
  saveGoals, saveRules, saveCategoryCustomization, saveAccounts, saveDefaultAccountId, saveAccentColor, saveOnboardingComplete,
  saveTutorialSeen, saveAssets, saveSyncId, saveDashboardVisibility, saveUnlockedAchievements, clearAllData
} from "@/lib/localstorage"
import { getCategoryTotals } from "@/lib/categories"
import { savingsCategoryForGoal, isSavingsCategory, STARTING_BALANCE_CATEGORY, INVESTMENT_CATEGORY } from "@/lib/consts"
import { processRecurring } from "@/lib/recurring"
import { importFromCSV } from "@/lib/csv"
import { exportToJSON, importFromJSON } from "@/lib/data"
import { autoCategories } from "@/lib/rules"
import { categoryCustomization } from "@/lib/categoryCustomization"
import { colord } from "colord"
import { getNetWorthHistory } from "@/lib/calculations/calculations"
import { getMonthlyReportData } from "@/lib/calculations/calculations"
import { ArrowLeftRight, CalendarDays, LayoutDashboard, Repeat, Settings, Target, Search, LineChart, Trophy } from "lucide-react"
import { get12MonthForecast } from "@/lib/calculations/calculations"
import { getSampleData } from "@/lib/sampleData"
import { TourGuide } from "@/components/tutorials/tourGuide"
import { pushSyncData, pullSyncData } from "@/lib/sync"
import { getPortfolioSummary } from "@/lib/calculations/investmentCalculations"
import { ACHIEVEMENTS, checkAchievements, CheckedAchievement } from "@/lib/achievements"

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [budgets, setBudgets] = useState<Record<string, number>>({})

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [transactionType, setTransactionType] = useState<"income" | "expense" | "transfer">("expense")
  const [category, setCategory] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [notes, setNotes] = useState("")

  const [open, setOpen] = useState(false)
  const [goalDialogOpen, setGoalDialogOpen] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)

  const [currency, setCurrency] = useState("USD")

  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("lifetime")

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  const [recurring, setRecurring] = useState<RecurringTransaction[]>([])

  const [rules, setRules] = useState<Rule[]>([])

  const [categoryCustomization, setCategoryCustomization] = useState<Record<string, categoryCustomization>>({})

  const [accounts, setAccounts] = useState<Account[]>([])

  const [defaultAccountId, setDefaultAccountId] = useState<string>("")

  const [accentColor, setAccentColor] = useState<string>("")

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [onboardingComplete, setOnboardingComplete] = useState(false)

  const [commandOpen, setCommandOpen] = useState(false)

  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [tutorialSeen, setTutorialSeen] = useState(false)
  const [tourActive, setTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(0)

  const [syncId, setSyncId] = useState("")
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSynced, setLastSynced] = useState<string | null>(null)
  const [sessionPassword, setSessionPassword] = useState<string | null>(null)

  const [assets, setAssets] = useState<Asset[]>([])

  const [dashboardVisibility, setDashboardVisibility] = useState<DashboardVisibility>({
    networth: true,
    networth_history: true,
    upcoming: true,
    smart_stats: true,
    trend: true,
    forecast: true,
    accounts: true,
    breakdown: true,
  })

  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false)
  const [checkedAchievements, setCheckedAchievements] = useState<Record<string, CheckedAchievement>>({})
  const prevCheckedRef = useRef<Record<string, CheckedAchievement>>({})

  // load localstorage 
  useEffect(() => {
    const data = loadAllData()
    setTransactions(data.transactions)
    setCategories(data.categories)
    setBudgets(data.budgets)
    setCurrency(data.currency)
    setRecurring(data.recurring)
    setGoals(data.goals)
    setRules(data.rules)
    setCategoryCustomization(data.categoryCustomization)
    setAccounts(data.accounts || [])
    setDefaultAccountId(data.defaultAccountId || "")
    setAccentColor(data.accentColor || "")
    setOnboardingComplete(data.onboardingComplete || false)
    setTutorialSeen(data.tutorialSeen || false)
    setSyncId(data.syncId || "")
    setAssets(data.assets || [])
    setDashboardVisibility(data.dashboardVisibility)

    const savedUnlocked = data.achievements || []
    const initialChecked: Record<string, CheckedAchievement> = {}
    ACHIEVEMENTS.forEach(ach => {
      initialChecked[ach.id] = {
        id: ach.id,
        currentValue: 0,
        unlocked: savedUnlocked.includes(ach.id)
      }
    })
    setCheckedAchievements(initialChecked)
    prevCheckedRef.current = initialChecked

    setIsLoaded(true)
  }, [])

  // write to localstorage on data change

  useEffect(() => {
    if (isLoaded) {
      saveTransactions(transactions)
    }
  }, [isLoaded, transactions])

  useEffect(() => {
    if (isLoaded) {
      saveCategories(categories)
    }
  }, [isLoaded, categories])

  useEffect(() => {
    if (isLoaded) {
      saveBudgets(budgets)
    }
  }, [isLoaded, budgets])

  useEffect(() => {
    if (!isLoaded) {
      return
    }
    setBudgets((prev) => {
      const updated = { ...prev }
      categories.forEach((category) => {
        if (!(category in updated)) {
          updated[category] = 0
        }
      })
      return updated
    })
  }, [categories])

  useEffect(() => {
    if (isLoaded) {
      saveCurrency(currency)
    }
  }, [isLoaded, currency])

  useEffect(() => {
    if (isLoaded) {
      saveRecurring(recurring)
    }
  }, [isLoaded, recurring])

  useEffect(() => {
    if (isLoaded) {
      saveGoals(goals)
    }
  }, [isLoaded, goals])

  useEffect(() => {
    if (isLoaded) {
      saveRules(rules)
    }
  }, [isLoaded, rules])

  useEffect(() => {
    if (isLoaded) {
      saveCategoryCustomization(categoryCustomization)
    }
  }, [isLoaded, categoryCustomization])

  useEffect(() => {
    if (isLoaded) {
      saveAccounts(accounts)
    }
  }, [isLoaded, accounts])

  useEffect(() => {
    if (isLoaded) {
      saveDefaultAccountId(defaultAccountId)
    }
  }, [isLoaded, defaultAccountId])

  useEffect(() => {
    if (isLoaded) {
      if (accentColor) {
        const c = colord(accentColor)

        if (!c.isValid()) {
          return
        }

        document.documentElement.style.setProperty("--primary", accentColor)

        const foreground = c.isDark() ? "#ffffff" : "#000000"
        document.documentElement.style.setProperty("--primary-foreground", foreground)
        document.documentElement.style.setProperty("--ring", accentColor)

        document.documentElement.style.setProperty("--accent", accentColor)
        document.documentElement.style.setProperty("--accent-foreground", foreground)
        saveAccentColor(accentColor)
      } else {
        document.documentElement.style.removeProperty("--primary")
        document.documentElement.style.removeProperty("--primary-foreground")
        document.documentElement.style.removeProperty("--ring")
        document.documentElement.style.removeProperty("--accent")
        document.documentElement.style.removeProperty("--accent-foreground")
        saveAccentColor("")
      }
    }
  }, [isLoaded, accentColor])

  const hasBudgets = Object.values(budgets).some(value => value > 0)
  const allStepsDone = accounts.length > 0 && categories.length > 0 && hasBudgets && goals.length > 0 && transactions.length > 0

  useEffect(() => {
    if (isLoaded && allStepsDone && !onboardingComplete) {
      setOnboardingComplete(true)
    }
  }, [isLoaded, allStepsDone, onboardingComplete])

  useEffect(() => {
    if (isLoaded) {
      saveOnboardingComplete(onboardingComplete)
    }
  }, [isLoaded, onboardingComplete])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return (
      () => document.removeEventListener("keydown", down)
    )
  }, [])

  useEffect(() => {
    if (isLoaded) {
      saveTutorialSeen(tutorialSeen)
    }
  }, [isLoaded, tutorialSeen])

  useEffect(() => {
    if (isLoaded && !tutorialSeen && transactions.length === 0 && accounts.length === 0 && goals.length === 0) {
      setTutorialOpen(true)
    }
  }, [isLoaded, tutorialSeen, transactions, accounts, goals])

  useEffect(() => {
    if (isLoaded) {
      saveAssets(assets)
    }
  }, [isLoaded, assets])

  // auto sync
  useEffect(() => {
    if (!isLoaded || !syncId || !sessionPassword) return

    const syncTimer = setTimeout(() => {
      const state = {
        transactions, goals, categories, budgets, currency,
        recurring, rules, categoryCustomization, accounts,
        defaultAccountId, accentColor, onboardingComplete, assets
      }

      pushSyncData(syncId, sessionPassword, state)
        .then(() => {
          setLastSynced(new Date().toLocaleString())
        })
        .catch((error) => {
          console.error("Auto-sync failed:", error)
        })
    }, 3000)

    return () => clearTimeout(syncTimer)
  }, [
    isLoaded, syncId, sessionPassword,
    transactions, goals, categories, budgets, currency,
    recurring, rules, categoryCustomization, accounts,
    defaultAccountId, accentColor, assets
  ])

  useEffect(() => {
    if (isLoaded) {
      saveDashboardVisibility(dashboardVisibility)
    }
  }, [isLoaded, dashboardVisibility])

  useEffect(() => {
    if (isLoaded) {
      const unlockedIds = Object.values(checkedAchievements).filter(e => e.unlocked).map(e => e.id)
      saveUnlockedAchievements(unlockedIds)
    }
  }, [isLoaded, checkedAchievements])

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    const currentChecked = checkAchievements(transactions, goals, assets)

    const justGot = Object.values(currentChecked).filter(
      ev => ev.unlocked && (!prevCheckedRef.current[ev.id] || !prevCheckedRef.current[ev.id].unlocked)
    )

    if (justGot.length > 0) {
      if (justGot.length === 1) {
        const ach = ACHIEVEMENTS.find(a => a.id === justGot[0].id)
        toast.success(`🏆 Achievement Unlocked!`, { description: ach?.title })
      } else {
        toast.success(`🏆 ${justGot.length} Achievements Unlocked!`, { description: "Check the achievements page to see what you earned." })
      }
    }

    prevCheckedRef.current = currentChecked
    setCheckedAchievements(currentChecked)
  }, [isLoaded, transactions, goals, assets])

  const lifetimeIncome = calculateIncome(transactions)
  const lifetimeExpenses = calculateExpenses(transactions)
  const totalAssetsValue = getPortfolioSummary(assets).totalValue
  const balance = lifetimeIncome - lifetimeExpenses + totalAssetsValue
  const currencySymbol = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "CA$", AUD: "A$", CHF: "Fr", INR: "₹" }[currency] ?? "$"

  const now = new Date()
  const thisMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      return false
    }
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear() &&
      transaction.category !== STARTING_BALANCE_CATEGORY
    )
  })

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      return false
    }
    return (
      date >= startOfPrevMonth &&
      date < startOfThisMonth &&
      transaction.category !== STARTING_BALANCE_CATEGORY
    )
  })

  const income = calculateIncome(thisMonthTransactions)
  const expenses = calculateExpenses(thisMonthTransactions)
  const filteredTransactions = filterTransactionsByPeriod(transactions, filterPeriod)
  const categoryTotals = getCategoryTotals(filteredTransactions)
  const prevCategoryTotals = getCategoryTotals(prevMonthTransactions)
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstOfMonthLabel = firstOfMonth.toLocaleDateString(undefined, { month: "long", day: "numeric" })
  const monthlyTrends = getMonthlyTrends(transactions)

  const prevTransactions = transactions.filter(transaction => new Date(transaction.date) < startOfThisMonth)
  const prevBalance = calculateIncome(prevTransactions) - calculateExpenses(prevTransactions)

  const netWorthHistory = getNetWorthHistory(transactions)

  const monthlyReportData = getMonthlyReportData(transactions)

  const forecastData = get12MonthForecast(balance, recurring)

  function addTransaction(
    isRecurring: boolean,
    interval: RecurringTransaction["interval"],
    customIntervalValue?: number,
    customIntervalUnit?: "days" | "weeks" | "months",
    splits?: TransactionSplit[],
    accountId?: string,
    transferAccountId?: string,
    tags?: string[]
  ) {
    const numberCheck = Number(amount)

    const hasValidSplits = splits && splits.length > 0 && splits.every(split => split.category && split.amount > 0)

    if (!description || !amount || Number.isNaN(numberCheck) || numberCheck <= 0) {
      return
    }

    if (!hasValidSplits && !category && transactionType !== "transfer") {
      return
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: numberCheck,
      type: transactionType,
      category: hasValidSplits ? "Split" : (transactionType === "transfer" ? "Transfer" : category),
      date: new Date().toISOString(),
      notes: notes || undefined,
      splits: splits,
      accountId: accountId,
      transferAccountId: transferAccountId,
      tags: tags
    }

    setTransactions((prev) => [newTransaction, ...prev])

    if (isRecurring) {
      const newRecurring: RecurringTransaction = {
        id: crypto.randomUUID(),
        description,
        amount: numberCheck,
        type: transactionType,
        category: hasValidSplits ? "Split" : category,
        interval,
        customIntervalValue,
        customIntervalUnit,
        lastProcessedDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
      setRecurring((prev) => [...prev, newRecurring])
    }

    setDescription("")
    setAmount("")
    setCategory("")
    setNotes("")
    setTransactionType("expense")
    setOpen(false)
  }

  function deleteTransaction(id: string) {
    const transaction = transactions.find((transaction) => transaction.id === id)
    if (!transaction) {
      return
    }

    if (isSavingsCategory(transaction.category)) {
      setGoals((prev) =>
        prev.map((goal) =>
          savingsCategoryForGoal(goal.name) === transaction.category ? { ...goal, currentAmount: Math.max(0, goal.currentAmount - transaction.amount)} : goal
        )
      )
    }

    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))

    toast("Transaction deleted", {
      action: {
        label: "Undo",
        onClick: () => {
          setTransactions((prev) => [transaction, ...prev])

          if (isSavingsCategory(transaction.category)) {
            setGoals((prev) => prev.map((goal) =>
              savingsCategoryForGoal(goal.name) === transaction.category ? { ...goal, currentAmount: goal.currentAmount + transaction.amount} : goal
            ))
          }
        }
      }
    })
  }

  function duplicateTransaction(id: string) {
    const transaction = transactions.find((transaction) => transaction.id === id)
    if (!transaction) {
      return
    }

    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    }
    setTransactions((prev) => [newTransaction, ...prev])

    if (isSavingsCategory(transaction.category)) {
      setGoals((prev) => prev.map((goal) =>
        savingsCategoryForGoal(goal.name) === transaction.category ? { ...goal, currentAmount: goal.currentAmount + transaction.amount} : goal
      ))
    }
    toast.success("Transaction duplicated")
  }

  function deleteTransactions(ids: string[]) {
    const deleted = transactions.filter((transaction) => ids.includes(transaction.id))
    if (deleted.length === 0) {
      return
    }

    deleted.forEach((transaction) => {
      if (isSavingsCategory(transaction.category)) {
        setGoals((prev) => prev.map((goal) =>
          savingsCategoryForGoal(goal.name) === transaction.category ? { ...goal, currentAmount: Math.max(0, goal.currentAmount - transaction.amount)} : goal
        ))
      }
    })
    setTransactions((prev) => prev.filter((transaction) => !ids.includes(transaction.id)))

    toast(`${deleted.length} transactions deleted`, {
      action: {
        label: "Undo",
        onClick: () => {
          setTransactions((prev) => [...deleted, ...prev])

          deleted.forEach((transaction) => {
            if (isSavingsCategory(transaction.category)) {
              setGoals((prev) => prev.map((goal) =>
                savingsCategoryForGoal(goal.name) === transaction.category ? { ...goal, currentAmount: goal.currentAmount + transaction.amount} : goal
              ))
            }
          })
        }
      }
    })
  }

  function categorizeTransactions(ids: string[], category: string) {
    setTransactions((prev) => prev.map((transaction) => ids.includes(transaction.id) ? { ...transaction, category} : transaction))
    toast.success(`${ids.length} transactions categorized as ${category}`)
  }

  function editTransaction(id: string, description: string, amount: number, type: "income" | "expense" | "transfer", category: string, notes?: string, tags?: string[], accountId?: string, transferAccountId?: string) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? {
          ...transaction,
          description,
          amount,
          category,
          type,
          notes: notes || undefined,
          tags: tags,
          accountId: accountId || undefined,
          transferAccountId: transferAccountId || undefined
        } : transaction
      ))
  }

  function saveGoal(id: string | null, name: string, currentAmount: number, targetAmount: number, targetDate?: string) {
    if (id) {
      const existingGoal = goals.find((goal) => goal.id === id)
      if (existingGoal && existingGoal.name !== name) {
        const oldCategory = savingsCategoryForGoal(existingGoal.name)
        const renamedCategory = savingsCategoryForGoal(name)

        setCategories((prev) => prev.map((category) => (category === oldCategory ? renamedCategory : category)))
        setBudgets((prev) => {
          if (!(oldCategory in prev)) {
            return prev
          }
          const updated = { ...prev }
          updated[renamedCategory] = updated[oldCategory]
          delete updated[oldCategory]
          return updated
        })
        setTransactions((prev) =>
          prev.map((transaction) => (transaction.category === oldCategory ? { ...transaction, category: renamedCategory } : transaction))
        )
      }
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? { ...goal, name, currentAmount, targetAmount, targetDate } : goal))
      )
    } else {
      const newGoal: Goal = {
        id: crypto.randomUUID(),
        name,
        currentAmount,
        targetAmount,
        targetDate
      }
      setGoals((prev) => [...prev, newGoal])
    }
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((goal) => goal.id !== id))
  }

  function addCategory() {
    if (!newCategory) {
      return
    }

    if (categories.includes(newCategory.trim())) {
      return
    }
    setCategories((prev) => [...prev, newCategory.trim()])
    setNewCategory("")
  }

  function deleteCategory(categoryToDelete: string) {

    if (isSavingsCategory(categoryToDelete)) {
      return
    }

    setCategories((prev) =>
      prev.filter((category) => category !== categoryToDelete)
    )
    setBudgets((prev) => {
      const updated = { ...prev }
      delete updated[categoryToDelete]
      return updated
    })

    setCategoryCustomization((prev) => {
      if (!(categoryToDelete in prev)) {
        return prev
      }
      const updated = { ...prev }
      delete updated[categoryToDelete]
      return updated
    })

    setRules((prev) => prev.filter((rule) => rule.category !== categoryToDelete))

    setTransactions((prev) =>
      prev.map((transaction) => {
        if (transaction.category === categoryToDelete) {
          return { ...transaction, category: "Uncategorized" }
        }
        if (transaction.splits && transaction.splits.some((split) => split.category === categoryToDelete)) {
          return {
            ...transaction,
            splits: transaction.splits.map((split) =>
              split.category === categoryToDelete ? { ...split, category: "Uncategorized" } : split
            ),
          }
        }
        return transaction
      })
    )
  }

  function updateBudget(category: string, limit: number) {
    setBudgets((prev) => ({ ...prev, [category]: limit }))
  }

  function contributeToGoal(goalId: string, amount: number) {
    const goal = goals.find((goal) => goal.id === goalId)
    if (!goal) {
      return
    }

    const goalCategory = savingsCategoryForGoal(goal.name)

    setGoals((prev) =>
      prev.map((goal) => (goal.id === goalId ? { ...goal, currentAmount: goal.currentAmount + amount } : goal))
    )

    setCategories((prev) => {
      if (prev.includes(goalCategory)) {
        return prev
      }
      return [...prev, goalCategory]
    })

    const savingsTransaction: Transaction = {
      id: crypto.randomUUID(),
      description: `Savings towards ${goal.name}`,
      amount,
      type: "expense",
      category: goalCategory,
      date: new Date().toISOString(),
    }
    setTransactions((prev) => [savingsTransaction, ...prev])
  }

  useEffect(() => {
    if (!isLoaded || recurring.length === 0) {
      return
    }
    const { newTransactions, updatedRecurring } = processRecurring(recurring)
    if (newTransactions.length > 0) {
      setTransactions((prev) => [...newTransactions, ...prev])
      setRecurring(updatedRecurring)
    }
  }, [isLoaded])

  function deleteRecurring(id: string) {
    setRecurring((prev) => prev.filter((recurring) => recurring.id !== id))
  }

  async function handleImportCSV(file: File) {
    try {
      const importedTransactions = await importFromCSV(file, accounts)
      if (importedTransactions.length === 0) {
        toast.error("No valid transactions found in your uploaded CSV")
        return
      }

      const categorizedTransactions = importedTransactions.map(transaction => {
        if (transaction.type === "transfer") {
          return transaction
        }
        const matchedCategory = autoCategories(transaction.description, rules)
        return (
          matchedCategory ? {
            ...transaction,
            category: matchedCategory
          } : transaction
        )
      })

      setTransactions(prev => [...categorizedTransactions, ...prev])

      const newCategories = new Set<string>();
      categorizedTransactions.forEach((transaction) => {
        if (transaction.splits && transaction.splits.length > 0) {
          transaction.splits.forEach((split) => newCategories.add(split.category))
        } else {
          newCategories.add(transaction.category)
        }
      })

      setCategories(prev => {
        const existing = new Set(prev);
        const ignoredCategories = ["Split", "Transfer", "Uncategorized", STARTING_BALANCE_CATEGORY, ""]
        const categoriesToAdd = Array.from(newCategories).filter(category => !existing.has(category) && !isSavingsCategory(category) && !ignoredCategories.includes(category));
        return [
          ...prev,
          ...categoriesToAdd
        ]
      });

      toast.success(`Successfully imported ${categorizedTransactions.length} transactions`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to import CSV. Please make sure it's formatted correctly and try again")
    }
  }

  function handleExportBackup() {
    exportToJSON({
      transactions,
      goals,
      categories,
      budgets,
      currency,
      recurring,
      rules,
      categoryCustomization,
      accounts,
      defaultAccountId,
      accentColor,
      onboardingComplete,
      assets,
      dashboardVisibility,
      unlockedAchievements: Object.values(checkedAchievements).filter(e => e.unlocked).map(e => e.id)
    })
  }

  async function handleImportBackup(file: File) {
    const data = await importFromJSON(file)

    if (!data) {
      toast.error("Failed to import backup file. Make sure it's a valid backup file and try again")
      return
    }

    setTransactions(data.transactions || [])
    setGoals(data.goals || [])
    setCategories(data.categories || [])
    setBudgets(data.budgets || {})
    setCurrency(data.currency || "USD")
    setRecurring(data.recurring || [])
    setRules(data.rules || [])
    setCategoryCustomization(data.categoryCustomization || {})
    setAccounts(data.accounts || [])
    setDefaultAccountId(data.defaultAccountId || "")
    setAccentColor(data.accentColor || "")
    setOnboardingComplete(data.onboardingComplete || false)
    setAssets(data.assets || [])

    setDashboardVisibility(data.dashboardVisibility || {
      networth: true,
      networth_history: true,
      upcoming: true,
      smart_stats: true,
      trend: true,
      forecast: true,
      accounts: true,
      breakdown: true
    })

    const savedUnlocked = data.unlockedAchievements || []
    const initialChecked: Record<string, CheckedAchievement> = {}
    ACHIEVEMENTS.forEach(ach => {
      initialChecked[ach.id] = {
        id: ach.id,
        currentValue: 0,
        unlocked: savedUnlocked.includes(ach.id)
      }
    })
    setCheckedAchievements(initialChecked)
    prevCheckedRef.current = initialChecked

    toast.success("Backup file imported successfully")
  }

  function handleClearData() {
    clearAllData()

    setTransactions([])
    setGoals([])
    setCategories([])
    setBudgets({})
    setCurrency("USD")
    setRecurring([])
    setRules([])
    setCategoryCustomization({})
    setAccounts([])
    setDefaultAccountId("")
    setAccentColor("")
    setOnboardingComplete(false)

    setAssets([])
    setCheckedAchievements({})
    prevCheckedRef.current = {}

    setSyncId("")
    setSessionPassword(null)
    setLastSynced(null)

    setTourActive(false)
    setTourStep(0)

    setTutorialOpen(true)

    toast.success("All data has been cleared")
  }

  function handleAddNewCategory(name: string) {
    if (!name.trim() || categories.includes(name.trim())) {
      return
    }
    setCategories(prev => [...prev, name.trim()])
  }

  function addRule(contains: string, category: string) {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      contains,
      category
    }
    setRules(prev => [...prev, newRule])
  }

  function deleteRule(id: string) {
    setRules(prev => prev.filter(rule => rule.id !== id))
  }

  function updateCategoryCustomization(category: string, customization: categoryCustomization) {
    setCategoryCustomization(prev => ({
      ...prev,
      [category]: customization
    }))
  }

  function addAccount(name: string, startingBalance: number = 0) {
    if (!name.trim()) {
      return
    }

    const newAccountId = crypto.randomUUID()
    setAccounts(prev => [...prev, { id: newAccountId, name: name.trim() }])

    if (startingBalance > 0) {
      const startingTransaction: Transaction = {
        id: crypto.randomUUID(),
        description: `Starting balance for ${name.trim()}`,
        amount: startingBalance,
        type: "income",
        category: STARTING_BALANCE_CATEGORY,
        date: new Date().toISOString(),
        accountId: newAccountId
      }
      setTransactions(prev => [startingTransaction, ...prev])
    }
  }

  function deleteAccount(id: string) {
    setAccounts(prev => prev.filter(account => account.id !== id))
    if (defaultAccountId === id) {
      setDefaultAccountId("")
    }

    setTransactions(prev =>
      prev.map(transaction => ({
        ...transaction,
        accountId: transaction.accountId === id ? undefined : transaction.accountId,
        transferAccountId: transaction.transferAccountId === id ? undefined : transaction.transferAccountId,
      }))
    )
  }

  function updateAccount(id: string, data: Partial<Omit<Account, 'id'>>) {
    setAccounts(prev => prev.map(account => account.id === id ? { ...account, ...data } : account))
  }

  function toggleSubscriptionActive(id: string, isActive: boolean) {
    setRecurring(prev => prev.map(recurring => recurring.id === id ? { ...recurring, isActive } : recurring))
  }

  const accountBalances = accounts.map(account => {
    let accBalance = 0

    transactions.forEach(transaction => {
      if (transaction.accountId === account.id) {
        if (transaction.type === "income") {
          accBalance += transaction.amount
        }
        if (transaction.type === "expense") {
          accBalance -= transaction.amount
        }
        if (transaction.type === "transfer") {
          accBalance -= transaction.amount
        }
      }

      if (transaction.transferAccountId === account.id) {
        accBalance += transaction.amount
      }
    })

    return {
      ...account,
      balance: accBalance
    }
  })

  function handleLoadSampleData() {
    const sampleData = getSampleData()
    setTransactions(sampleData.transactions)
    setGoals(sampleData.goals)
    setCategories(sampleData.categories)
    setBudgets(sampleData.budgets)
    setCurrency(sampleData.currency)
    setRecurring(sampleData.recurring)
    setRules(sampleData.rules)
    setCategoryCustomization(sampleData.categoryCustomization)
    setAccounts(sampleData.accounts)
    setDefaultAccountId(sampleData.defaultAccountId)
    setTutorialSeen(true)
    setTourActive(true)
    setTourStep(0)
  }

  function handleFinishTour() {
    setTourActive(false)
    setTourStep(0)
    setTransactions([])
    setGoals([])
    setCategories([])
    setBudgets({})
    setRecurring([])
    setRules([])
    setCategoryCustomization({})
    setAccounts([])
    setDefaultAccountId("")
    setAccentColor("")
    toast.success("Tour finished! Start adding your own data.")
  }

  function addAsset(name: string, ticker: string, type: InvestmentType, notes?: string) {
    if (!name.trim()) {
      return
    }

    const newAsset: Asset = {
      id: crypto.randomUUID(),
      name: name.trim(),
      ticker: ticker || undefined,
      type,
      notes,
      transactions: []
    }
    setAssets((prev) => [...prev, newAsset])
  }

  function deleteAsset(id: string) {
    setAssets((prev) => prev.filter((asset) => asset.id !== id))
  }

  function updateAsset(id: string, name: string, ticker: string, type: InvestmentType, notes?: string) {
    setAssets((prev) => prev.map((asset) =>
      asset.id === id ? {
        ...asset,
        name,
        ticker: ticker || undefined,
        type,
        notes
      } : asset
    ))
  }

  function handleLogInvestmentTransaction(assetId: string, type: "buy" | "sell" | "update", quantity: number, pricePerUnit: number, date: string, notes?: string) {
    const asset = assets.find((a) => a.id === assetId)
    if (!asset) {
      return
    }

    const newInvestmentTransaction: InvestmentTransaction = {
      id: crypto.randomUUID(),
      type,
      date,
      quantity,
      pricePerUnit,
      notes
    }

    setAssets((prev) => prev.map((a) =>
      a.id === assetId ? { ...a, transactions: [...a.transactions, newInvestmentTransaction] } : a
    ))

    if (type !== "update") {
      const totalCashValue = quantity * pricePerUnit
      const isBuy = type === "buy"

      setCategories((prev) => prev.includes(INVESTMENT_CATEGORY) ? prev : [...prev, INVESTMENT_CATEGORY])

      const cashTransaction: Transaction = {
        id: crypto.randomUUID(),
        description: `${isBuy ? "Bought" : "Sold"} ${quantity} ${asset.ticker || asset.name} @ ${currencySymbol}${pricePerUnit.toFixed(2)}`,
        amount: totalCashValue,
        type: isBuy ? "expense" : "income",
        category: INVESTMENT_CATEGORY,
        date: date,
        notes: notes,
        accountId: defaultAccountId || undefined
      }
      setTransactions((prev) => [cashTransaction, ...prev])
    }
  }

  function getCurrentState() {
    return {
      transactions, goals, categories, budgets, currency,
      recurring, rules, categoryCustomization, accounts,
      defaultAccountId, accentColor, onboardingComplete, assets,
      dashboardVisibility, unlockedAchievements: Object.values(checkedAchievements).filter(e => e.unlocked).map(e => e.id),
    }
  }

  async function handleEnableSync(newId: string, password: string) {
    setIsSyncing(true)
    try {
      const state = getCurrentState()
      await pushSyncData(newId, password, state)

      setSyncId(newId)
      setSessionPassword(password)
      saveSyncId(newId)
      setLastSynced(new Date().toLocaleString())
      toast.success("Sync enabled!")
    } catch (error) {
      toast.error("Failed to enable sync")
      throw error
    } finally {
      setIsSyncing(false)
    }
  }

  async function handlePushData(passwordOverride?: string) {
    if (!syncId) return

    const passwordToUse = passwordOverride || sessionPassword

    if (!passwordToUse) {
      toast.error("Please enter your password to resume sync")
      return
    }

    setIsSyncing(true)
    try {
      if (passwordOverride) {
        await pullSyncData(syncId, passwordOverride)
      }

      const state = getCurrentState()
      await pushSyncData(syncId, passwordToUse, state)
      
      setSessionPassword(passwordToUse)
      setLastSynced(new Date().toLocaleString())
      toast.success("Sync unlocked and data pushed successfully!")
    } catch (error) {
      if (error instanceof Error && error.message.includes("Invalid password")) {
        toast.error("Wrong password. Please check your password and try again")
      } else {
        console.error("Push Error:", error)
        toast.error("Failed to push data. Check your connection")
      }
      throw error
    } finally {
      setIsSyncing(false)
    }
  }

  async function handlePullData(id: string, password: string) {
    setIsSyncing(true)
    try {
      const pulledState = await pullSyncData(id, password)
      const data = pulledState as any

      setTransactions(data.transactions || [])
      setGoals(data.goals || [])
      setCategories(data.categories || [])
      setBudgets(data.budgets || {})
      setCurrency(data.currency || "USD")
      setRecurring(data.recurring || [])
      setRules(data.rules || [])
      setCategoryCustomization(data.categoryCustomization || {})
      setAccounts(data.accounts || [])
      setDefaultAccountId(data.defaultAccountId || "")
      setAccentColor(data.accentColor || "")
      setAssets(data.assets || [])

      setDashboardVisibility(data.dashboardVisibility || {
        networth: true,
        networth_history: true,
        upcoming: true,
        smart_stats: true,
        trend: true,
        forecast: true,
        accounts: true,
        breakdown: true
      })

      const savedUnlocked = data.unlockedAchievements || []
      const initialChecked: Record<string, CheckedAchievement> = {}
      ACHIEVEMENTS.forEach(ach => {
        initialChecked[ach.id] = {
          id: ach.id,
          currentValue: 0,
          unlocked: savedUnlocked.includes(ach.id)
        }
      })
      setCheckedAchievements(initialChecked)
      prevCheckedRef.current = initialChecked

      setSyncId(id)
      setSessionPassword(password)
      saveSyncId(id)
      setLastSynced(new Date().toLocaleString())
      toast.success("Data pulled successfully!")
    } catch (error) {
      toast.error("Failed to pull data. Check your ID and password")
      throw error
    } finally {
      setIsSyncing(false)
    }
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background">
        <LoadingSkeleton />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold sm:text-4xl">DimeTrack</h1>

          <Button
            variant="outline"
            className="w-full sm:flex-1 sm:max-w-sm flex items-center gap-2 text-muted-foreground justify-start font-normal"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left hidden sm:inline">Search transactions or jump to...</span>
            <span className="flex-1 text-left sm:hidden">Search...</span>
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              CTRL + K
            </kbd>
          </Button>

          <div className="flex items-center gap-2 justify-end">
            <ThemeToggle />
            {!onboardingComplete && (
              <Onboarding
                hasAccounts={accounts.length > 0}
                hasCategories={categories.length > 0}
                hasBudgets={hasBudgets}
                hasGoals={goals.length > 0}
                hasTransactions={transactions.length > 0}
                onOpenSettings={() => setSettingsOpen(true)}
                onOpenBudgets={() => setActiveTab("budgets")}
                onCreateGoal={() => { setActiveTab("budgets"); setEditingGoal(null); setGoalDialogOpen(true) }}
                onAddTransaction={() => { setActiveTab("transactions"); setOpen(true) }}
                onComplete={() => setOnboardingComplete(true)}
              />
            )}
            <MonthlyReport data={monthlyReportData} currencySymbol={currencySymbol} />

            <Button variant="outline" size="icon" onClick={() => setIsAchievementsOpen(true)} className="relative">
              <Trophy className="w-4 h-4" />
              {Object.values(checkedAchievements).filter(e => e.unlocked).length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {Object.values(checkedAchievements).filter(e => e.unlocked).length}
                </span>
              )}
            </Button>

            <Button variant="outline" onClick={() => setSettingsOpen(true)} className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <AchievementsDialog open={isAchievementsOpen} onOpenChange={setIsAchievementsOpen} checkedAchievements={checkedAchievements} />
            <SettingsDialog
              categories={categories}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              onAddNewCategory={addCategory}
              onDeleteCategory={deleteCategory}
              currency={currency}
              currencySymbol={currencySymbol}
              onCurrencyChange={setCurrency}
              recurring={recurring}
              onDeleteRecurring={deleteRecurring}
              onImportCSV={handleImportCSV}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onClearData={handleClearData}
              rules={rules}
              onAddRule={addRule}
              onDeleteRule={deleteRule}
              categoryCustomization={categoryCustomization}
              onUpdateCategoryCustomization={updateCategoryCustomization}
              accounts={accounts}
              onAddAccount={addAccount}
              onDeleteAccount={deleteAccount}
              defaultAccountId={defaultAccountId}
              onSetDefaultAccount={setDefaultAccountId}
              onUpdateAccount={updateAccount}
              accentColor={accentColor}
              onAccentChange={setAccentColor}
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
              syncId={syncId}
              hasSessionPassword={!!sessionPassword}
              onEnableSync={handleEnableSync}
              onPullData={handlePullData}
              onPushData={handlePushData}
              isSyncing={isSyncing}
              lastSynced={lastSynced}
              dashboardVisibility={dashboardVisibility}
              onUpdateDashboardVisibility={(key, value) => setDashboardVisibility(prev => ({...prev, [key]: value }))}
            />
          </div>
        </header>

        {/* income & expense cards */}
        <div className="grid gap-4 md:grid-cols-2 sm:gap-6">
          <div className="rounded-2xl border p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">Income since - {firstOfMonthLabel}</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">{currencySymbol}{income.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">Expenses since - {firstOfMonthLabel}</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600 sm:text-3xl">{currencySymbol}{expenses.toFixed(2)}</h2>
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex-1 sm:flex-initial gap-1.5">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex-1 sm:flex-initial gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1 sm:flex-initial gap-1.5">
              <ArrowLeftRight className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex-1 sm:flex-initial gap-1.5">
              <Repeat className="w-4 h-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="investments" className="flex-1 sm:flex-initial gap-1.5">
              <LineChart className="w-4 h-4" />
              <span className="hidden sm:inline">Investments</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="flex-1 sm:flex-initial gap-1.5">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Budgets & Goals</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {dashboardVisibility.networth && (
              <NetWorth currentBalance={balance} previousBalance={prevBalance} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.networth_history && (
              <NetWorthHistoryChart data={netWorthHistory} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.upcoming && (
              <UpcomingTransactions recurring={recurring} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.smart_stats && (
              <SmartStats monthlyExpenses={expenses} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.trend && (
              <TrendChart data={monthlyTrends} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.forecast && (
              <ForecastChart data={forecastData} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.accounts && (
              <AccountBalances accounts={accountBalances} currencySymbol={currencySymbol} />
            )}
            {dashboardVisibility.breakdown && (
              <div className="grid gap-4 md:grid-cols-2">
                <CategoryBreakdown totals={categoryTotals} currencySymbol={currencySymbol} />
                <SpendingChart totals={categoryTotals} categoryCustomization={categoryCustomization} currencySymbol={currencySymbol} />
              </div>
            )}
          </TabsContent>

          {/* Calendar */}
          <TabsContent value="timeline" className="space-y-6 mt-4">
            <CashFlowTimeline currentBalance={balance} recurring={recurring} currencySymbol={currencySymbol} />
          </TabsContent>

          {/* Subscriptions tab */}
          <TabsContent value="subscriptions" className="space-y-6 mt-4">
            <Subscriptions
              recurring={recurring}
              currencySymbol={currencySymbol}
              onToggleActive={toggleSubscriptionActive}
              onDelete={deleteRecurring}
              onAddTransaction={() => { setActiveTab("transactions"); setOpen(true) }} />
          </TabsContent>

          {/* transactions tab */}
          <TabsContent value="transactions" className="space-y-6 mt-4">
            <div className="flex justify-end">
              {/* Add transaction button */}
              <AddTransactionDialog
                open={open}
                setOpen={setOpen}
                description={description}
                setDescription={setDescription}
                amount={amount}
                setAmount={setAmount}
                categories={categories.filter(category => !isSavingsCategory(category))}
                category={category}
                setCategory={setCategory}
                transactionType={transactionType}
                setTransactionType={setTransactionType}
                onSave={addTransaction}
                onAddNewCategory={handleAddNewCategory}
                budgets={budgets}
                categoryTotals={categoryTotals}
                currencySymbol={currencySymbol}
                notes={notes}
                setNotes={setNotes}
                rules={rules}
                accounts={accounts}
                defaultAccountId={defaultAccountId}
              />
            </div>

            {/* Recent transactions card */}
            <div className="rounded-2xl border p-4 sm:p-6">
              <EditTransactionDialog
                transaction={editingTransaction}
                open={!!editingTransaction}
                onClose={() => setEditingTransaction(null)}
                categories={categories.filter(category => !isSavingsCategory(category))}
                onSave={editTransaction}
                budgets={budgets}
                categoryTotals={categoryTotals}
                currencySymbol={currencySymbol}
                rules={rules}
                accounts={accounts} />
              <TransactionList
                transactions={filteredTransactions}
                onEditClick={setEditingTransaction}
                onDelete={deleteTransaction}
                onDuplicate={duplicateTransaction}
                onBulkDelete={deleteTransactions}
                onBulkCategorize={categorizeTransactions}
                currencySymbol={currencySymbol}
                filter={filterPeriod}
                onFilterChange={setFilterPeriod}
                categories={categories}
                accounts={accounts}
                onAddTransaction={() => setOpen(true)}
                categoryCustomization={categoryCustomization}
              />
            </div>
          </TabsContent>

          {/* investments tab */}
          <TabsContent value="investments" className="space-y-6 mt-4">
            <Investments 
              assets={assets}
              currencySymbol={currencySymbol} 
              onAddAsset={addAsset}
              onUpdateAsset={updateAsset}
              onLogInvestmentTransaction={handleLogInvestmentTransaction} 
              onDeleteAsset={deleteAsset} />
          </TabsContent>

          {/* budgets and goals tab */}
          <TabsContent value="budgets" className="space-y-6 mt-4">
            {/* Goal card */}
            <GoalsSelection
              goals={goals}
              transactions={transactions}
              currencySymbol={currencySymbol}
              onCreateGoal={() => { setEditingGoal(null); setGoalDialogOpen(true) }}
              onEditGoal={(goal) => { setEditingGoal(goal); setGoalDialogOpen(true) }}
              onDeleteGoal={deleteGoal}
              onContribute={contributeToGoal}
            />

            {/* Edit goal button */}
            <GoalDialog open={goalDialogOpen} setOpen={setGoalDialogOpen} goal={editingGoal} onSave={saveGoal} />
            {/* budget */}
            <BudgetOverview
              totals={categoryTotals}
              prevTotals={prevCategoryTotals}
              budgets={budgets}
              onUpdateBudget={updateBudget}
              currencySymbol={currencySymbol}
              monthlyIncome={income}
              categoryCustomization={categoryCustomization} />
          </TabsContent>
        </Tabs>
        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          transactions={transactions}
          onTabChange={(tab) => setActiveTab(tab)}
          onAddTransaction={() => { setActiveTab("transactions"); setOpen(true) }}
          onOpenSettings={() => setSettingsOpen(true)}
          onAddGoal={() => { setActiveTab("budgets"); setEditingGoal(null); setGoalDialogOpen(true) }}
          onExportBackup={handleExportBackup}
        />
        <TutorialDialog open={tutorialOpen} onClose={() => { setTutorialOpen(false); setTutorialSeen(true) }} onLoadSampleData={handleLoadSampleData} />
        {tourActive && (
          <TourGuide
            step={tourStep}
            setStep={setTourStep}
            activeTab={activeTab}
            isAddDialogOpen={open}
            isGoalDialogOpen={goalDialogOpen}
            isSettingsOpen={settingsOpen}
            transactionCount={transactions.length}
            goalsCount={goals.length}
            categoriesCount={categories.length}
            rulesCount={rules.length}
            onFinishTour={handleFinishTour}
            onSkip={() => { setTourActive(false); setTourStep(0) }}
          />
        )}
      </div>
    </main>
  )
}