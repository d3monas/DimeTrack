import { useState } from "react"
import type { Account } from "@/types/account"

type AccountsManagerThings = {
    accounts: Account[]
    onAddAccount: (name: string) => void
    onDeleteAccount: (id: string) => void
}