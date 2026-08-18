# DimeTrack

A simple, open-source money tracker and savings planner.

**Check it out ->** https://dime-track.vercel.app/ 

## Features

- Track Checking, Savings, and Cash separately. Move money with transfers that don't inflate your income or expenses.
- Search and filter transactions by description, amount, category or transaction type. Perform bulk actions on transactions, including changing categories, accounts, types and deleting multiple transactions at a time.
- Export your transactions to CSV or create full JSON backups to transfer your data to any device.
- Set multiple savings goals at a time and contribute towards them directly, with full contribution history. Set savings goals with target dates and the app will calculate how much you need to save and contribute per month to hit your goal.
- Create custom categories & set budget limits, with warnings as you approach them.
- Split a single purchase across multiple categories.
- Track your finances with interactive charts, category breakdowns, net worth history and monthly spending reports.
- Project upcoming bills and predict your spending before it happens with the cash flow timeline.
- Multi-currency support.
- Schedule recurring transactions for bills, subscriptions, salaries, and more.
- Manage your subscriptions with the dedicated subscriptions manager.
- Set rules (e.g. "If description contains Uber, set category to Transport")
- Track your investments and monitor your portfolio value over time with the investment tracker.
- Personalize the app with a built-in color picker. Choose from presets or use a custom Hex code. Customize your accounts and categories with custom icons and colors, and personalize your dashboard with customizable widgets.
- View balances for every account and your total net worth at a glance.
- Mobile friendly UI.
- No accounts, subscriptions, or servers required. Everything stays on your device by default, with optional cloud sync for accessing your data across devices.

## Screenshots

A complete overview of your finances
<br>

<img width="1035" height="2633" alt="image" src="https://github.com/user-attachments/assets/620e20f3-00ce-48eb-926a-6a15c6b5dd25" />

### Accounts
Manage multiple accounts, see balances of each & all accounts instantly
<br>
<img width="813" height="110" alt="image" src="https://github.com/user-attachments/assets/81bed91b-b665-4969-a2b3-90f35a6f27da" />

### Transactions
Create, split, add recurring transactions in seconds. Repeating the same transaction over and over again? Create a preset!
<br>
<img width="360" height="593" alt="image" src="https://github.com/user-attachments/assets/68c290af-884f-4e38-8da8-f3539f299b22" />
<br>

### Goals
Create multiple goals, set target dates and get contribution suggestions
<img width="1011" height="362" alt="image" src="https://github.com/user-attachments/assets/9ffbfcbf-8938-467c-afb6-175ad9e3d39b" /><br>
<img width="360" height="234" alt="image" src="https://github.com/user-attachments/assets/6f4aad35-da29-4c45-b7a5-a83b65df1c9a" /><br>

### Analytics
Track your Net Worth growth & where your money goes
<img width="1004" height="364" alt="image" src="https://github.com/user-attachments/assets/98e704cc-8ff2-463f-8b67-17f870db36ba" /><br>
<img width="1006" height="750" alt="image" src="https://github.com/user-attachments/assets/50b9a9cf-b420-4824-a35d-b9c00a6e9da9" /><br>
<img width="501" height="358" alt="image" src="https://github.com/user-attachments/assets/1e1db821-74e8-4aa4-9b81-88ed8282213e" /><br>

### Investments
See your money grow
<img width="1015" height="729" alt="image" src="https://github.com/user-attachments/assets/d510fc9a-9c07-41d9-8142-85194f564331" /><br>

### Timeline
See your how recurring transactions affect your balance & see balance projections
<img width="896" height="794" alt="image" src="https://github.com/user-attachments/assets/573672dd-1426-445a-b8ad-3870fecbd1f5" /><br>

### Settings
Create accounts, categories, rules, update currency, customize & more
<br>
<img width="477" height="742" alt="image" src="https://github.com/user-attachments/assets/c1abd2b1-a689-4aae-941d-9bb8d03a9759" /><br>
<img width="479" height="790" alt="image" src="https://github.com/user-attachments/assets/b2d56827-0b41-4614-9daf-60a43ec977d1" /><br>
<img width="428" height="612" alt="image" src="https://github.com/user-attachments/assets/190a0062-9153-4e2d-86a6-ca4e57db1722" /><br>
<img width="424" height="403" alt="image" src="https://github.com/user-attachments/assets/e902c900-3e5c-46f0-9835-896a6e47d19f" /><br>

### Optional Cloud Sync
End-to-End Cloud Syncing between devices. Nobody can read your data.
<br>
<img width="425" height="437" alt="image" src="https://github.com/user-attachments/assets/5e889f8f-88b6-480c-b975-11f3bd66afc3" /><br>

Built with:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Lucide React
- react-colorful
- colord
- @upstash/redis

## Running locally

Want to run DimeTrack locally? Not a problem!:

- `git clone https://github.com/d3monas/dimetrack.git`
- `cd dimetrack`
- `npm install`
- `npm run dev`

Then open http://localhost:3000 in your browser.
> NOTE: some features rely on `crypto.randomUUID()`, which requires a secure context. This works while testing on `localhost`, but if you are testing on another device over
> your local network, use a tool like Vercel to test over HTTPS, because features like adding transactions will not work. Cloud syncing WILL NOT work on `localhost`
