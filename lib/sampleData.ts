import { Account } from "@/types/account"
import { categoryCustomization } from "./categoryCustomization"

export function getSampleData() {
  const now = new Date()
  const daysAgo = (days: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  const accounts: Account[] = [
    { id: "acc-1", name: "Checking", color: "#3b82f6", icon: "Wallet" },
    { id: "acc-2", name: "Savings", color: "#22c55e", icon: "PiggyBank" }
  ]

  const categories = ["Salary", "Rent", "Groceries", "Entertainment", "Transport", "Savings: Vacation"]
  
  const categoryCustomization: Record<string, categoryCustomization> = {
    "Salary": { color: "#22c55e", icon: "Briefcase" },
    "Rent": { color: "#ef4444", icon: "Home" },
    "Groceries": { color: "#f59e0b", icon: "ShoppingCart" },
    "Entertainment": { color: "#8b5cf6", icon: "Gamepad2" },
    "Transport": { color: "#06b6d4", icon: "Car" },
    "Savings: Vacation": { color: "#ec4899", icon: "Plane" }
  }
}