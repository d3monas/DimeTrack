import { useState } from "react"
import type { Account } from "@/types/account"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { EmptyState } from "../emptyState"

type AccountsManagerThings = {
    accounts: Account[]
    onAddAccount: (name: string) => void
    onDeleteAccount: (id: string) => void
}

export function AccountsManager({ accounts, onAddAccount, onDeleteAccount }: AccountsManagerThings) {
    const [name, setName] = useState("")

    function handleAdd() {
        if (!name.trim()) {
            return
        }
        onAddAccount(name.trim())
        setName("")
    }

    return (
        <div>
            <h3 className="font-semibold mb-2">Accounts</h3>
            <p className="text-sm text-muted-foreground mb-3">Track money in different places (e.g., Checking, Savings, Cash)</p>
            <div className="flex flex-col gap-2 sm:flex-row mb-4">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Checking" />
                <Button onClick={handleAdd}>Add Account</Button>
            </div>
            <div className="space-y-2">
                {accounts.length === 0 ? (
                    <EmptyState message="No accounts yet. Transaction will default to 'Uncategorized'" />
                ) : (
                    accounts.map((account) => (
                        <div key={account.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md p-2 border">
                            <span className="break-all text-sm">{account.name}</span>
                            <Button variant="destructive" size="sm" onClick={() => onDeleteAccount(account.id)}>Delete</Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}