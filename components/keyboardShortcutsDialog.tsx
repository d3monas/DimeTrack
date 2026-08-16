import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Keyboard } from "lucide-react"

type KeyboardShortcutsDialogThings = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogThings) {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0
  const modKey = isMac ? "CMD" : "CTRL"
  const altKey = isMac ? "OPT" : "ALT"

  const shortcuts = [
    { keys: [modKey, "K"], action: "Open Search / Command Bar" },
    { keys: [altKey, "N"], action: "Add New Transaction" },
    { keys: [altKey, "1"], action: "Go to Overview" },
    { keys: [altKey, "2"], action: "Go to Timeline" },
    { keys: [altKey, "3"], action: "Go to Transactions" },
    { keys: [altKey, "4"], action: "Go to Subscriptions" },
    { keys: [altKey, "5"], action: "Go to Investments" },
    { keys: [altKey, "6"], action: "Go to Budgets & Goals" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" /> Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm text-foreground/90">{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((key, j) => (
                  <kbd key={j} className="min-w-10 text-center inline-flex h-6 items-center justify-center rounded border bg-background px-1.5 font-mono text-[10px] font-bold text-muted-foreground">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}