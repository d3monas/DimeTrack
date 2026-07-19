"use client"
// components
import { useState, useEffect } from "react"
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
import { CalendarView } from "@/components/calendarView"
import { AccountBalances } from "@/components/accountBalances"
import { SmartStats } from "@/components/smartStats"

// types
import type { Transaction, TransactionSplit } from "@/types/transaction"
import type { Goal } from "@/types/goal"
import type { FilterPeriod } from "@/lib/calculations"
import type { RecurringTransaction } from "@/types/recurringTransaction"
import type { Rule } from "@/types/rule"
import type { Account } from "@/types/account"

// libs
import { calculateIncome, calculateExpenses, filterTransactionsByPeriod, getMonthlyTrends } from "@/lib/calculations"
import {
  saveTransactions, saveCategories, saveBudgets, saveCurrency, loadAllData, saveRecurring,
  saveGoals, saveRules, saveCategoryCustomization, saveAccounts, saveDefaultAccountId, clearAllData
} from "@/lib/localstorage"
import { getCategoryTotals } from "@/lib/categories"
import { savingsCategoryForGoal, isSavingsCategory, STARTING_BALANCE_CATEGORY } from "@/lib/consts"
import { processRecurring } from "@/lib/recurring"
import { importFromCSV } from "@/lib/csv"
import { exportToJSON, importFromJSON } from "@/lib/data"
import { autoCategories } from "@/lib/rules"
import { categoryCustomization } from "@/lib/categoryCustomization"

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

  const lifetimeIncome = calculateIncome(transactions)
  const lifetimeExpenses = calculateExpenses(transactions)
  const balance = lifetimeIncome - lifetimeExpenses
  const currencySymbol = { USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "CA$", AUD: "A$", CHF: "Fr", INR: "₹" }[currency] ?? "$"

  const now = new Date()
  const thisMonthTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    if (isNaN(date.getTime())) {
      return false
    }
    return (
      date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    )
  })
  const income = calculateIncome(thisMonthTransactions)
  const expenses = calculateExpenses(thisMonthTransactions)
  const filteredTransactions = filterTransactionsByPeriod(transactions, filterPeriod)
  const categoryTotals = getCategoryTotals(filteredTransactions)
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstOfMonthLabel = firstOfMonth.toLocaleDateString(undefined, { month: "long", day: "numeric" })
  const monthlyTrends = getMonthlyTrends(transactions)

  function addTransaction(
    isRecurring: boolean,
    interval: RecurringTransaction["interval"],
    customIntervalValue?: number,
    customIntervalUnit?: "days" | "weeks" | "months",
    splits?: TransactionSplit[],
    accountId?: string,
    transferAccountId?: string
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

    if (transaction && isSavingsCategory(transaction.category)) {
      setGoals((prev) =>
        prev.map((goal) =>
          savingsCategoryForGoal(goal.name) === transaction.category ? { ...goal, currentAmount: Math.max(0, goal.currentAmount - transaction.amount) } : goal
        )
      )
    }
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id))
  }

  function editTransaction(id: string, description: string, amount: number, type: "income" | "expense" | "transfer", category: string, notes?: string) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...transaction, description, amount, category, type, notes: notes || undefined } : transaction
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
      accounts
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
  }

  function updateAccount(id: string, data: Partial<Omit<Account, 'id'>>) {
    setAccounts(prev => prev.map(account => account.id === id ? { ...account, ...data } : account))
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
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold sm:text-4xl">DimeTrack</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
              onUpdateAccount={updateAccount} />
          </div>
        </header>

        {/* Current balance card */}
        <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
          <div className="rounded-2xl border p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">Current Balance <span className="text-xs">(All Time)</span></p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{currencySymbol}{balance.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">Income since - {firstOfMonthLabel}</p>
            <h2 className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">{currencySymbol}{income.toFixed(2)}</h2>
          </div>

          <div className="rounded-2xl border p-4 sm:p-6">
            <p className="text-sm text-muted-foreground">Expenses since - {firstOfMonthLabel}</p>
            <h2 className="mt-2 text-2xl font-bold text-red-600 sm:text-3xl">{currencySymbol}{expenses.toFixed(2)}</h2>
          </div>
        </div>


        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md sm:text-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets & Goals</TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* upcoming recurring transactions */}
            <UpcomingTransactions recurring={recurring} currencySymbol={currencySymbol} />
            {/* smart stats */}
            <SmartStats monthlyExpenses={expenses} currencySymbol={currencySymbol} />
            {/* Trend */}
            <TrendChart data={monthlyTrends} currencySymbol={currencySymbol} />
            {/* account balances */}
            <AccountBalances accounts={accountBalances} currencySymbol={currencySymbol} />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Breakdown into categories */}
              <CategoryBreakdown totals={categoryTotals} currencySymbol={currencySymbol} />
              {/* chart */}
              <SpendingChart totals={categoryTotals} categoryCustomization={categoryCustomization} currencySymbol={currencySymbol} />
            </div>
          </TabsContent>

          {/* Calendar */}
          <TabsContent value="calendar" className="space-y-6 mt-4">
            <CalendarView transactions={transactions} recurring={recurring} currencySymbol={currencySymbol} />
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
                currencySymbol={currencySymbol}
                filter={filterPeriod}
                onFilterChange={setFilterPeriod}
                categories={categories}
                accounts={accounts} />
            </div>
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
              budgets={budgets}
              onUpdateBudget={updateBudget}
              currencySymbol={currencySymbol}
              monthlyIncome={income}
              categoryCustomization={categoryCustomization} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}