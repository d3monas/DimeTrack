import type { Account } from "@/types/account"

type AccountBalancesThings = {
    accounts: (Account & { balance: number })[]
    currencySymbol: string
}

export function AccountBalances({ accounts, currencySymbol }: AccountBalancesThings) {
    if (accounts.length === 0) {
        return null
    }

    return (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {accounts.map((account) => (
                <div key={account.id} className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground truncate">{account.name}</p>
                    <h3 className={`mt-1 text-lg font-bold ${account.balance < 0 ? "text-red-600" : "text-foreground"}`}>{currencySymbol}{account.balance.toFixed(2)}</h3>
                </div>
            ))}
        </div>
    )
}