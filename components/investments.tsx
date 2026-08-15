import { useState } from "react"
import type { Asset, InvestmentType } from "@/types/asset"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { FieldError } from "./fieldError"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./ui/select"
import { getAssetSummary, getPortfolioSummary, getPortfolioHistory } from "@/lib/calculations/investmentCalculations"
import { Trash2, PlusCircle, TrendingUp, TrendingDown, Wallet, Pencil } from "lucide-react"
import { PortfolioChart } from "./charts/portfolioChart"
import { ConfirmDialog } from "./ui/confirmDialog"

type InvestmentsThings = {
  assets: Asset[]
  currencySymbol: string
  onAddAsset: (name: string, ticker: string, type: InvestmentType, notes?: string) => void
  onUpdateAsset: (id: string, name: string, ticker: string, type: InvestmentType, notes?: string) => void
  onLogInvestmentTransaction: (assetId: string, type: "buy" | "sell" | "update", quantity: number, pricePerUnit: number, date: string, notes?: string) => void
  onDeleteAsset: (id: string) => void
}

const assetTypes: InvestmentType[] = ["Stock", "ETF", "Crypto", "Other"]

export function Investments({ assets, currencySymbol, onAddAsset, onUpdateAsset, onLogInvestmentTransaction, onDeleteAsset }: InvestmentsThings) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isTransactionOpen, setIsTransactionOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  
  const [name, setName] = useState("")
  const [ticker, setTicker] = useState("")
  const [type, setType] = useState<InvestmentType>("Stock")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [transactionType, setTransactionType] = useState<"buy" | "sell" | "update">("buy")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split("T")[0])
  const [transactionNotes, setTransactionNotes] = useState("")
  
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null)
  
  const portfolio = getPortfolioSummary(assets)
  const historyData = getPortfolioHistory(assets)

  function handleAddAsset() {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) {
      newErrors.name = "Asset name is required"
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onAddAsset(name.trim(), ticker.trim().toUpperCase(), type, notes.trim() || undefined)
    setName("")
    setTicker("")
    setType("Stock")
    setNotes("")
    setErrors({})
    setIsAddOpen(false)
  }

  function handleEditAsset() {
    if (!selectedAsset) {
      return
    }
    const newErrors: Record<string, string> = {}
    if (!name.trim()) {
      newErrors.name = "Asset name is required"
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onUpdateAsset(selectedAsset.id, name.trim(), ticker.trim().toUpperCase(), type, notes.trim() || undefined)
    setName("")
    setTicker("")
    setType("Stock")
    setNotes("")
    setErrors({})
    setIsEditOpen(false)
  }

  function handleLogtransaction() {
    if (!selectedAsset) return
    const newErrors: Record<string, string> = {}
    const qty = Number(quantity)
    const prc = Number(price)

    if (transactionType !== "update" && (!quantity || Number.isNaN(qty) || qty <= 0)) newErrors.quantity = "Enter valid quantity"
    if (!price || Number.isNaN(prc) || prc < 0) newErrors.price = "Enter valid price"
    
    if (transactionType === "sell") {
      const summary = getAssetSummary(selectedAsset)
      if (qty > summary.quantity) newErrors.quantity = "Cannot sell more than you own"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const finalDate = new Date().toISOString()
    const finalQty = transactionType === "update" ? 0 : qty

    onLogInvestmentTransaction(selectedAsset.id, transactionType, finalQty, prc, finalDate, transactionNotes.trim() || undefined)
    
    setTransactionType("buy")
    setQuantity("")
    setPrice("")
    setTransactionNotes("")
    setTransactionDate(new Date().toISOString().split("T")[0])
    setErrors({})
    setIsTransactionOpen(false)
  }

  function opentransactionDialog(asset: Asset, defaulttransactionType: "buy" | "sell" | "update") {
    setSelectedAsset(asset)
    setTransactionType(defaulttransactionType)
    setQuantity("")
    setPrice("")
    setTransactionNotes("")
    setTransactionDate(new Date().toISOString().split("T")[0])
    setErrors({})
    setIsTransactionOpen(true)
  }

  function openEditDialog(asset: Asset) {
    setSelectedAsset(asset)
    setName(asset.name)
    setTicker(asset.ticker || "")
    setType(asset.type)
    setNotes(asset.notes || "")
    setErrors({})
    setIsEditOpen(true)
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3 sm:gap-6">
        <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-sm font-medium">Portfolio Value</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-primary">{currencySymbol}{portfolio.totalValue.toFixed(2)}</h2>
        </div>
        <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">Total Invested</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold">{currencySymbol}{portfolio.totalCost.toFixed(2)}</h2>
        </div>
        <div className="rounded-2xl border p-4 sm:p-6 bg-muted/20">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">Total Profit / Loss</span>
          </div>
          <h2 className={`mt-2 text-2xl font-bold flex items-center gap-2 ${portfolio.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            {portfolio.totalProfitLoss >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {currencySymbol}{Math.abs(portfolio.totalProfitLoss).toFixed(2)} ({portfolio.plPercentage.toFixed(2)}%)
          </h2>
        </div>
      </div>

      <PortfolioChart data={historyData} currencySymbol={currencySymbol} />

      <div className="rounded-2xl border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Assets</h2>
          <Dialog open={isAddOpen} onOpenChange={(v) => { setIsAddOpen(v); if (!v) setErrors({}) }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1" onClick={() => setIsAddOpen(true)}>
                <PlusCircle className="h-4 w-4" /> Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Asset Name</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }} placeholder="e.g., Apple Inc." />
                  <FieldError message={errors.name} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Ticker / Symbol</Label>
                    <Input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="e.g., AAPL" />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(v) => setType(v as InvestmentType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {assetTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Long term hold" className="resize-none" rows={2} />
                </div>
                <Button className="w-full" onClick={handleAddAsset}>Add Asset</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No assets tracked yet. Add your first investment to start tracking your portfolio!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => {
              const summary = getAssetSummary(asset)
              return (
                <div key={asset.id} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{asset.name}</h3>
                        {asset.ticker && <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{asset.ticker}</span>}
                        <span className="text-xs text-muted-foreground">({asset.type})</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>Qty: <span className="font-medium text-foreground">{summary.quantity.toFixed(4)}</span></span>
                        <span>Avg Cost: <span className="font-medium text-foreground">{currencySymbol}{summary.avgBuyPrice.toFixed(2)}</span></span>
                        <span>Current: <span className="font-medium text-foreground">{currencySymbol}{summary.currentPrice.toFixed(2)}</span></span>
                      </div>
                      {asset.notes && <p className="text-xs italic text-muted-foreground/80 mt-2">{asset.notes}</p>}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="font-bold text-lg">{currencySymbol}{summary.currentValue.toFixed(2)}</p>
                        <p className={`text-xs font-medium flex items-center justify-end gap-1 ${summary.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {summary.totalProfitLoss >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {currencySymbol}{Math.abs(summary.totalProfitLoss).toFixed(2)} ({summary.plPercentage.toFixed(2)}%)
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => opentransactionDialog(asset, "buy")}>Buy</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => opentransactionDialog(asset, "sell")}>Sell</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => opentransactionDialog(asset, "update")}>Update</Button>
                        <Button size="sm" variant="ghost" className="h-7" onClick={() => openEditDialog(asset)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-red-500" onClick={() => setAssetToDelete(asset.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={(v) => { setIsEditOpen(v); if (!v) setErrors({}) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Asset Name</Label>
              <Input value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: "" })) }} />
              <FieldError message={errors.name} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Ticker / Symbol</Label>
                <Input value={ticker} onChange={(e) => setTicker(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as InvestmentType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {assetTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="resize-none" rows={2} />
            </div>
            <Button className="w-full" onClick={handleEditAsset}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTransactionOpen} onOpenChange={(v) => { setIsTransactionOpen(v); if (!v) setErrors({}) }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{transactionType === "buy" ? "Buy" : transactionType === "sell" ? "Sell" : "Update Price"} {selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {transactionType !== "update" && (
              <div>
                <Label>Transaction Type</Label>
                <Select value={transactionType} onValueChange={(v) => setTransactionType(v as "buy" | "sell" | "update")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {transactionType !== "update" && (
              <div>
                <Label>Quantity</Label>
                <Input type="number" min="0" step="any" value={quantity} onChange={(e) => { setQuantity(e.target.value); if (errors.quantity) setErrors((p) => ({ ...p, quantity: "" })) }} placeholder="0.00" />
                <FieldError message={errors.quantity} />
              </div>
            )}

            <div>
              <Label>{transactionType === "update" ? "New Price Per Unit" : "Price Per Unit"}</Label>
              <Input type="number" min="0" step="any" value={price} onChange={(e) => { setPrice(e.target.value); if (errors.price) setErrors((p) => ({ ...p, price: "" })) }} placeholder="0.00" />
              <FieldError message={errors.price} />
            </div>

            <div>
              <Label>Date</Label>
              <Input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea value={transactionNotes} onChange={(e) => setTransactionNotes(e.target.value)} placeholder="e.g., Bought the dip" className="resize-none" rows={2} />
            </div>

            <Button className="w-full" onClick={handleLogtransaction}>Confirm Transaction</Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!assetToDelete}
        onOpenChange={(open) => !open && setAssetToDelete(null)}
        title="Delete Asset?"
        description="This will permanently remove the asset and its transaction history from your portfolio. This action cannot be undone"
        onConfirm={() => assetToDelete && onDeleteAsset(assetToDelete)}
        confirmText="Delete"
      />
    </div>
  )
}