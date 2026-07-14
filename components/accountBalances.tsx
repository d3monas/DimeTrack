import type { Account } from "@/types/account"

type AccountBalancesThings = {
    accounts: (Account & { balance: number })[]
    currencySymbol: string
}

export function AccountBalances() {
    
}