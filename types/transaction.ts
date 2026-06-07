export type Transaction = {
  id: number,
  description: string,
  amount: number,
  type: "income" | "expense",
  date: string
}