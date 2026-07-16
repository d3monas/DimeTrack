import { useState } from "react"
import type { Account } from "@/types/account"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { EmptyState } from "../emptyState"
import { Label } from "../ui/label"
import { availableColors, availableIcons, getIconByName } from "@/lib/categoryCustomization"
import { PopoverTrigger, Popover, PopoverContent } from "../ui/popover"

type AccountsManagerThings = {
    accounts: Account[]
    onAddAccount: (name: string, startingBalance: number) => void
    onDeleteAccount: (id: string) => void
    defaultAccountId: string
    onSetDefaultAccount: (id: string) => void
    onUpdateAccount: (id: string, data: Partial<Omit<Account, 'id'>>) => void
}

export function AccountsManager({ accounts, onAddAccount, onDeleteAccount, defaultAccountId, onSetDefaultAccount, onUpdateAccount }: AccountsManagerThings) {
    const [name, setName] = useState("")
    const [startingBalance, setStartingBalance] = useState("")

    function handleAdd() {
        if (!name.trim()) {
            return
        }
        const balanceNum = Number(startingBalance) || 0
        onAddAccount(name.trim(), balanceNum)
        setName("")
        setStartingBalance("")
    }

    return (
        <div>
            <h3 className="font-semibold mb-2">Accounts</h3>
            <p className="text-sm text-muted-foreground mb-3">Track money in different places (e.g., Checking, Savings, Cash)</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end mb-4">
                <div className="flex-1">
                    <Label>Account Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Checking" />
                </div>
                <div className="w-full sm:w-32">
                    <Label>Starting balance</Label>
                    <Input type="number" min="0" step="0.01" value={startingBalance} onChange={(e) => setStartingBalance(e.target.value)} placeholder="0.00" />
                </div>
                <Button onClick={handleAdd}>Add Account</Button>
            </div>

            <div className="space-y-2">
                {accounts.length === 0 ? (
                    <EmptyState message="No accounts yet. Transaction will default to 'Uncategorized'" />
                ) : (
                    accounts.map((account) => {
                        const accColor = account.color || "#6b7280"
                        const accIcon = account.icon || "Wallet"
                        const Icon = getIconByName(accIcon)

                        return (
                            <div key={account.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md p-2 border">
                                <div className="flex items-center gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="h-8 w-8 rounded-md flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-ring" style={{ backgroundColor: accColor }}>
                                                <Icon className="h-4 w-4" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64">
                                            <div className="grid grid-cols-8 gap-2 mb-4">
                                                {availableColors.map(color => (
                                                    <button key={color} className="h-5 w-5 rounded-full border-2 hover:scale-110 transition-transform"
                                                        style={{ backgroundColor: color, borderColor: accColor === color ? "white" : "transparent" }}
                                                        onClick={() => onUpdateAccount(account.id, { color })} />
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-6 gap-2">
                                                {availableIcons.map(iconName => {
                                                    const I = getIconByName(iconName)
                                                    return (
                                                        <button key={iconName} 
                                                        className={`h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted ${accIcon === iconName ? 'bg-muted ring-1 ring-ring' : ''}`}
                                                        onClick={() => onUpdateAccount(account.id, { icon: iconName })}><I className="h-4 w-4" /></button>
                                                    )
                                                })}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <span className="break-all text-sm">{account.name}</span>
                                    {defaultAccountId === account.id && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Default</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {defaultAccountId !== account.id && (
                                        <Button variant="outline" size="sm" onClick={() => onSetDefaultAccount(account.id)}>Set Default</Button>
                                    )}
                                    <Button variant="destructive" size="sm" onClick={() => onDeleteAccount(account.id)}>Delete</Button>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}