import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type AddTransactionDialogThings = {
    open: boolean
    setOpen: (open: boolean) => void
    description: string
    setDescription: (value: string) => void
    amount: string
    setAmount: (value: string) => void
    transactionType: "income" | "expense"
    setTransactionType: (value: "income" | "expense") => void
    categories: string[]
    category: string
    setCategory: (value: string) => void
    onSave: () => void
}

export function AddTransactionDialog({
    open, setOpen, description, setDescription, amount, setAmount, transactionType, setTransactionType, category, setCategory, onSave, categories
}: AddTransactionDialogThings) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Transaction</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Description</Label>
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Coffee" />
                    </div>

                    <div>
                        <Label>Type</Label>

                        <Select value={transactionType} onValueChange={(value) => setTransactionType(value as "expense" | "income")}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>

                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Amount</Label>
                        <Input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5" />
                    </div>

                    <Button className="w-full" onClick={onSave}>Save Transaction</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}