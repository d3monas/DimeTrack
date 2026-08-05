import { useState } from "react"
import type { Asset } from "@/types/asset"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { FieldError } from "./fieldError"
import { Checkbox } from "./ui/checkbox"
import { Trash2, Pencil, PlusCircle, RefreshCw } from "lucide-react"

type InvestmentsThings = {
  assets: Asset[]
  currencySymbol: string
  onAddAsset: (name: string, value: number, notes?: string, isRecurring?: boolean) => void
  onUpdateAsset: (id: string, name: string, value: number, notes?: string, isRecurring?: boolean) => void
  onDeleteAsset: (id: string) => void
}

export function Investments({ assets, currencySymbol, onAddAsset, onUpdateAsset, onDeleteAsset }: InvestmentsThings) {
  const [open, setOpen] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [notes, setNotes] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

  function openAddDialog() {
    setEditingAsset(null)
    setName("")
    setValue("")
    setNotes("")
    setIsRecurring(false)
    setErrors({})
    setOpen(true)
  }

  function openEditDialog(asset: Asset) {
    setEditingAsset(asset)
    setName(asset.name)
    setValue(asset.value.toString())
    setNotes(asset.notes || "")
    setIsRecurring(asset.isRecurring || false)
    setErrors({})
    setOpen(true)
  }

  function handleSave() {
    const newErrors: Record<string, string> = {}
    const parsedValue = Number(value)
    if (!name.trim()) newErrors.name = "Asset name is required"
    if (!value || Number.isNaN(parsedValue)) newErrors.value = "Please enter a valid value"
    else if (parsedValue < 0) newErrors.value = "Value cannot be negative"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (editingAsset) {
      onUpdateAsset(editingAsset.id, name.trim(), parsedValue, notes.trim() || undefined, isRecurring)
    } else {
      onAddAsset(name.trim(), parsedValue, notes.trim() || undefined, isRecurring)
    }
    
    setOpen(false)
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
        <p className="text-sm text-muted-foreground">Total Asset Value</p>
        <h2 className="mt-2 text-2xl font-bold text-primary">{currencySymbol}{totalValue.toFixed(2)}</h2>
        <p className="text-xs text-muted-foreground mt-1">This total is automatically added to your Net Worth.</p>
      </div>

      <div className="rounded-2xl border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Assets</h2>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}) }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1" onClick={openAddDialog}>
                <PlusCircle className="h-4 w-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAsset ? "Edit Asset" : "Add Asset"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Asset Name</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }} placeholder="e.g., Bitcoin, Stocks" />
                  <FieldError message={errors.name} />
                </div>
                <div>
                  <Label>Current Value</Label>
                  <Input type="number" min="0" step="0.01" value={value} onChange={(e) => { setValue(e.target.value); if (errors.value) setErrors((p) => ({ ...p, value: "" })) }} placeholder="5000.00" />
                  <FieldError message={errors.value} />
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., 2 shares, updated monthly" className="resize-none" rows={2} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="recurring-asset" checked={isRecurring} onCheckedChange={(checked) => setIsRecurring(checked === true)} />
                  <Label htmlFor="recurring-asset" className="cursor-pointer flex items-center gap-1 text-sm">
                    <RefreshCw className="h-3 w-3" /> Recurring investment (add to this monthly)
                  </Label>
                </div>
                <Button className="w-full" onClick={handleSave}>{editingAsset ? "Save Changes" : "Save Asset"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No assets tracked yet. Add your first investment to boost your Net Worth!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex flex-wrap items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="min-w-0 mr-4">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{asset.name}</p>
                    {asset.isRecurring && <RefreshCw className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  {asset.notes && <p className="text-xs italic text-muted-foreground/80 mt-0.5">{asset.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg mr-2">{currencySymbol}{asset.value.toFixed(2)}</span>
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(asset)} aria-label="Edit asset">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDeleteAsset(asset.id)} aria-label="Delete asset">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}