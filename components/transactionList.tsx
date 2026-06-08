import { Transaction } from "@/types/transaction"
import { Button } from "./ui/button"

type Things = {
    transactions: Transaction[]
    onDelete(id: number): void
}

export function TransactionList({
    transactions,
    onDelete
}: Things) {
    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                        <p className="font-medium">{transaction.description}</p>

                        <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>{transaction.date}</span>
                            <span>•</span>
                            <span>{transaction.category}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}</span>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => onDelete(transaction.id)}>✕</Button>
                    </div>
                </div>
            ))}
        </div>
    )
}