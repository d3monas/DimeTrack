export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-bold">PennyPath</h1>
          <p className="text-muted-foreground">Track spending and save for goals.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border p-6">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <h2 className="mt-2 text-3xl font-bold">$324.50</h2>
          </div>
        </div>

        {/* Goal card */}
        <div className="mt-6 rounded-2xl border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">IPhone 17</h2>
              <p className="text-muted-foreground">Savings Goal</p>
            </div>

            <p className="font-bold">$420.00 / 999.99</p>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-green-600"
            style={{ width: "32%" }}
            />
        </div>

        <p className="mt-2 text-sm text-muted-foreground">$579.00 remaining</p>
        </div>

      {/* Recent transactions card */}
      <div className="mt-6 rounded-2xl border p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Birthday Money</span>
            <span className="font-medium text-green-600">+$50.00</span>
          </div>

          <div className="flex justify-between">
            <span>Spotify</span>
            <span className="font-medium text-red-600">-$11.00</span>
          </div>

          <div className="flex justify-between">
            <span>Breakfast</span>
            <span className="font-medium text-red-600">-$5.00</span>
          </div>
        </div>
      </div>

        <div className="rounded-2xl border p-6">
          <p className="text-sm text-muted-foreground">Income this month</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">$120.00</h2>
        </div>

        <div className="rounded-2xl border p-6">
          <p className="text-sm text-muted-foreground">Expenses this month</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">$45.00</h2>
        </div>
      </div>
    </main>
  )
}