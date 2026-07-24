# DimeTrack

A simple, open-source money tracker and savings planner.

**Check it out ->** https://dime-track.vercel.app/ 

## Features

- Track Checking, Savings, and Cash separately. Move money with transfers that don't inflate your income or expenses.
- Search and filter transactions by description, amount, category or transaction type.
- Export your transactions to CSV or create full JSON backups to transfer your data to any device.
- Set multiple savings goals at a time and contribute towards them directly, with full contribution history. Set savings goals with target dates and the app will calculate how much you need to save and contribute per month to hit your goal.
- Create custom categories & set budget limits, with warnings as you approach them.
- Split a single purchase across multiple categories.
- Track your finances with interactive charts, category breakdowns, net worth history and monthly spending reports.
- Project upcoming bills and predict your spending before it happens with cash flow calendar.
- Multi-currency support.
- Schedule recurring transactions for bills, subscriptions, salaries, and more.
- Set rules (e.g. "If description contains Uber, set category to Transport")
- Personalize the app with a built-in color picker. Choose from presets or use a custom Hex code.
- View balances for every account and your total net worth at a glance.
- Create custom spending categories with custom icons and colors.
- Mobile friendly UI.
- No accounts, subscriptions, servers. Everything stays in your device.

## Screenshots

A complete overview of your finances
<br>

<img width="1005" height="1885" alt="dark-dashboard" src="https://github.com/user-attachments/assets/494589d8-d36c-4be4-8f0f-c3af62144cae" />

### Accounts
Manage multiple accounts, see balances of each & all accounts instantly
<br>
<img width="1104" height="98" alt="image" src="https://github.com/user-attachments/assets/56742eaf-0e51-4b31-85fe-6fb2997c4502" />

### Transactions
Create, split, add recurring transactions in seconds
<br>
<img width="384" height="532" alt="image" src="https://github.com/user-attachments/assets/b035ca1c-8076-4b9a-878c-50c325a20e98" />
<br>

### Goals
Create multiple goals, set target dates and get contribution suggestions
<img width="1104" height="269" alt="image" src="https://github.com/user-attachments/assets/b4ead810-c25f-475f-938d-ecf487257616" /><br>
<img width="384" height="246" alt="image" src="https://github.com/user-attachments/assets/be75c1b8-8202-432f-8c30-b6c3503bbc4b" /><br>

### Analytics
Track your networth growth & where your money goes
<img width="1104" height="382" alt="image" src="https://github.com/user-attachments/assets/fdce3f9c-8a60-4960-8feb-29c1b2943187" /><br>
<img width="1104" height="382" alt="image" src="https://github.com/user-attachments/assets/97ff748f-17dd-4a13-b422-c6d2499539d4" /><br>
<img width="544" height="382" alt="image" src="https://github.com/user-attachments/assets/1d76c65c-08e9-43c1-ad2f-0cd1daff5fe1" /><br>


### Settings
Create accounts, categories, rules, update currency, customize & more
<br>
<img width="384" height="766" alt="image" src="https://github.com/user-attachments/assets/f7dea837-0c54-4c51-890a-67b60a9d3281" /><br>
<img width="384" height="426" alt="image" src="https://github.com/user-attachments/assets/9ea3dffa-e15b-4594-931f-cc0911566744" /><br>
<img width="384" height="574" alt="image" src="https://github.com/user-attachments/assets/550648be-d4bd-4e54-a018-dc11600676dd" /><br>
<img width="384" height="484" alt="image" src="https://github.com/user-attachments/assets/e824aed0-18cf-435d-997d-01981ea28a8b" /><br>

Built with:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Lucide React
- react-colorful
- colord

## Running locally

Want to run DimeTrack locally? Not a problem!:

- `git clone https://github.com/d3monas/dimetrack.git`
- `cd dimetrack`
- `npm install`
- `npm run dev`

Then open http://localhost:3000 in your browser.
> NOTE: some features rely on `crypto.randomUUID()`, which requires a secure context. This works while testing on `localhost`, but if you are testing on another device over
> your local network, use a tool like Vercel to test over HTTPS, because features like adding transactions will not work.
