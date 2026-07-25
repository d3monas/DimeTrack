import type { RecurringTransaction } from "@/types/recurringTransaction";
import { EmptyState } from "./emptyState";
import { getSubscriptionMetrics } from "@/lib/subscriptions";
import { CalendarDays, Tag, Trash2 } from "lucide-react";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

type SubscriptionsThings = {
  recurring: RecurringTransaction[]
  currencySymbol: string
  onToggleActive: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}

export function Subscriptions({ recurring, currencySymbol, onToggleActive, onDelete }: SubscriptionsThings) {
  const subs = recurring.filter(recurring => recurring.type === "expense")
  const metrics = getSubscriptionMetrics(recurring)

  if (subs.length === 0) {
    return (
      <div className="mt-6 rounded-2xl border p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">Subscriptions Auditor</h2>
        <EmptyState message="No recurring expenses yet" />
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
        <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
          <p className="text-sm text-muted-foreground">Monthly</p>
          <h2 className="mt-2 text-2xl font-bold text-red-600">{currencySymbol}{metrics.monthlyTotal.toFixed(2)}</h2>
        </div>
        <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
          <p className="text-sm text-muted-foreground">Annual</p>
          <h2 className="mt-2 text-2xl font-bold">{currencySymbol}{metrics.annualTotal.toFixed(2)}</h2>
        </div>
        <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
          <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          <h2 className="mt-2 text-2xl font-bold">{metrics.activeCount}</h2>
        </div>
      </div>

      <div className="rounded-2xl border p-4 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">Manage Subscriptions</h2>
        <div className="space-y-4">
          {subs.map((sub) => {
            const isActive = sub.isActive !== false
            return (
              <div key={sub.id} className="flex flex-wrap items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className={`font-medium ${isActive ? "line-through text-muted-foreground" : ""}`}>{sub.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{sub.interval}</span>
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{sub.category}</span>
                    <span className="font-bold text-red-600">-{currencySymbol}{sub.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{isActive ? "Active" : "Cancelled"}</span>
                    <Switch checked={isActive} onCheckedChange={(checked) => onToggleActive(sub.id, checked)} />
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(sub.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}