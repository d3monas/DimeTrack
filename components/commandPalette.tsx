import { Transaction } from "@/types/transaction"
import { DialogContent, Dialog, DialogHeader, DialogTitle } from "./ui/dialog"
import { CommandInput, Command, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "./ui/command"
import { CalendarDays, LayoutDashboard, PlusCircle, ArrowLeftRight, Repeat, Target, Search, PiggyBank, Settings, Download } from "lucide-react"

type CommandPaletteThings = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactions: Transaction[]
  onTabChange: (tab: string) => void
  onAddTransaction: () => void
  onOpenSettings: () => void
  onAddGoal: () => void
  onExportBackup: () => void
}

export function CommandPalette({ open, onOpenChange, transactions, onTabChange, onAddTransaction, onOpenSettings, onAddGoal, onExportBackup }: CommandPaletteThings) {
  const handleSelect = (action: () => void) => {
    action()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Menu</DialogTitle>
        </DialogHeader>
        
        <Command className="rounded-lg">
          <CommandInput placeholder="Type a command or search transactions..." />
          <CommandList className="max-h-100">
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => handleSelect(() => onAddTransaction())} value="add transaction">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Add Transaction</span>
              </CommandItem>
              {/* NEW ACTIONS */}
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
              <CommandItem onSelect={() => handleSelect(() => onTabChange("calendar"))} value="go to calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>Go to Calendar</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("transactions"))} value="go to transactions">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                <span>Go to Transactions</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => onTabChange("subscriptions"))} value="go to subscriptions">
                <Repeat className="mr-2 h-4 w-4" />
                <span>Go to Subscriptions</span>
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