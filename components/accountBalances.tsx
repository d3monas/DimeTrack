import type { Account } from "@/types/account"
import { getIconByName } from "@/lib/categoryCustomization"
import { DEFAULT_CATEGORY_COLOR, DEFAULT_ACCOUNT_ICON } from "@/lib/consts"
import { Wallet } from "lucide-react"

type AccountBalancesThings = {
    accounts: (Account & { balance: number })[]
    currencySymbol: string
}

export function AccountBalances({ accounts, currencySymbol }: AccountBalancesThings) {
    if (accounts.length === 0) {
        return null
    }

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

    return (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            <div className="rounded-xl border p-4 flex flex-col gap-2 bg-muted/40">
                <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md flex items-center justify-center text-background shrink-0 bg-foreground">
                        <Wallet className="h-3 w-3" />
                    </span>
                    <p className="truncate text-sm font-medium text-primary">Total Balance</p>
                </div>
                <h3 className={`text-lg font-bold ${totalBalance < 0 ? "text-red-600" : "text-foreground"}`}>{currencySymbol}{totalBalance.toFixed(2)}</h3>
            </div>


            {accounts.map((account) => {
                const accColor = account.color || DEFAULT_CATEGORY_COLOR
                const accIcon = account.icon || DEFAULT_ACCOUNT_ICON
                const Icon = getIconByName(accIcon)

                return (
                    <div key={account.id} className="rounded-xl border p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-md flex items-center justify-center text-white shrink-0" style={{ backgroundColor: accColor }}>
                                <Icon className="h-3 w-3" />
                            </span>
                            <p className="text-sm text-muted-foreground truncate">{account.name}</p>
                        </div>
                        <h3 className={`mt-1 text-lg font-bold ${account.balance < 0 ? "text-red-600" : "text-foreground"}`}>{currencySymbol}{account.balance.toFixed(2)}</h3>
                    </div>
                )
            })}
        </div>
    )
}