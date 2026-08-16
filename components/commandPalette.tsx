import { useState } from "react"
import { Transaction } from "@/types/transaction"
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "./ui/dialog"
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "./ui/command"
import { CalendarDays, LayoutDashboard, PlusCircle, ArrowLeftRight, Repeat, Target, Search, PiggyBank, Settings, Download, LineChart } from "lucide-react"
import type { Account } from "@/types/account"

type CommandPaletteThings = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: Transaction[]
  categories: string[]
  accounts: Account[]
  onTabChange: (tab: string) => void
  onAddTransaction: () => void
  onOpenSettings: () => void
  onAddGoal: () => void
  onExportBackup: () => void
  onQuickAdd: (amount: number, description: string, category: string, accountId?: string) => void
}

export function CommandPalette({ open, onOpenChange, transactions, categories, accounts, onTabChange, onAddTransaction, onOpenSettings, onAddGoal, onExportBackup, onQuickAdd }: CommandPaletteThings) {
  const [search, setSearch] = useState("")

  const parseQuickAdd = (input: string) => {
    const match = input.match(/^(\d+(?:\.\d+)?)\s+(.*)$/)
    if (!match) return null

    const amount = parseFloat(match[1])
    let rest = match[2].trim()
    let category = null
    let accountId: string | undefined = undefined
    let accountName: string | undefined = undefined
    let description = rest

    const words = rest.split(/\s+/)

    if (words.length >= 1) {
      const lastWord = words[words.length - 1]
      const foundAccount = accounts.find(a => a.name.toLowerCase() === lastWord.toLowerCase())
      if (foundAccount) {
        accountId = foundAccount.id
        accountName = foundAccount.name
        words.pop()
      }
    }

    if (words.length >= 1) {
      const lastWord = words[words.length - 1]
      const foundCategory = categories.find(c => c.toLowerCase() === lastWord.toLowerCase())
      if (foundCategory) {
        category = foundCategory
        words.pop()
      }
    }

    if (!category) {
      return null
    }

    if (words.length > 0) {
      description = words.join(" ")
    } else {
      description = category
    }

    return { amount, description, category, accountId, accountName }
  }

  const quickAddData = parseQuickAdd(search)

  const handleSelect = (action: () => void) => {
    action()
    onOpenChange(false)
    setSearch("")
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSearch("") }}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Menu</DialogTitle>
        </DialogHeader>
        
        <Command className="rounded-lg" shouldFilter={!quickAddData}>
          <CommandInput placeholder="Search or 'amount description [category] [account]...'" value={search} onValueChange={setSearch} className="text-sm h-9" />
          <CommandList className="max-h-100">
            <CommandEmpty>No results found.</CommandEmpty>
            
            {quickAddData && (
              <CommandGroup heading="Quick Add Expense">
                <CommandItem 
                  onSelect={() => handleSelect(() => onQuickAdd(quickAddData.amount, quickAddData.description, quickAddData.category, quickAddData.accountId))}
                  value={`quick add ${search}`}>
                  <PlusCircle className="mr-2 h-4 w-4 shrink-0" />
                  <div className="flex flex-col text-sm">
                    <span>Add <span className="font-bold">${quickAddData.amount.toFixed(2)}</span> - {quickAddData.description}</span>
                    <span className="text-xs text-muted-foreground">
                      Category: {quickAddData.category}{quickAddData.accountName ? ` | Account: ${quickAddData.accountName}` : ""}
                    </span>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => handleSelect(() => onAddTransaction())} value="add transaction">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Add Transaction</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onAddGoal())} value="add goal">
                <PiggyBank className="mr-2 h-4 w-4" />
                <span>Add Savings Goal</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onOpenSettings())} value="open settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Open Settings</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onExportBackup())} value="export backup">
                <Download className="mr-2 h-4 w-4" />
                <span>Export JSON Backup</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => handleSelect(() => onTabChange("overview"))} value="go to overview">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Go to Overview</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("timeline"))} value="go to timeline">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Go to Timeline</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("transactions"))} value="go to transactions">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                <span>Go to Transactions</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("subscriptions"))} value="go to subscriptions">
                <Repeat className="mr-2 h-4 w-4" />
                <span>Go to Subscriptions</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("investments"))} value="go to investments">
                <LineChart className="mr-2 h-4 w-4" />
                <span>Go to Investments</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("budgets"))} value="go to budgets">
                <Target className="mr-2 h-4 w-4" />
                <span>Go to Budgets & Goals</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Transactions">
              {transactions.map((tx) => (
                <CommandItem 
                  key={tx.id} 
                  value={`${tx.id} ${tx.description} ${tx.category} ${tx.amount} ${tx.type}`}
                  onSelect={() => handleSelect(() => onTabChange("transactions"))}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span className="font-medium">{tx.description}</span>
                  <span className="text-muted-foreground ml-2 text-sm">{tx.category}</span>
                  <span className={`ml-auto font-medium ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "income" ? "+" : "-"}{tx.amount.toFixed(2)}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}