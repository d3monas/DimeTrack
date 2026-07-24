# DimeTrack

A simple, open-source money tracker and savings planner.

**Check it out -> ** https://dime-track.vercel.app/ 

## Features

- Track Checking, Savings, and Cash separately. Move money with transfers that don't inflate your income or expenses.
- Search and filter transactions by description, amount, category or transaction type.
- Export your transactions to CSV or create full JSON backups to transfer your data to any device.
- Set multiple savings goals a time and contribute towards them directly, with full contribution history. Set savings goals with target dates and the app will calculate how much you need to save and contribute per month to hit your goal.
- Create custom categories & set budget limits, with warnings as you approach them.
- Split a single purchase across multiple categories.
- See how your wealth grows with charts and generate monthly spending reports.
- Project upcoming bills and predict your spending before it happens with cash flow calendar.
- Multi-currency support.
- Schedule recurring transactions for bills, subscriptions, salaries, and more.
- Set rules (e.g. "If description contains Uber, set category to Transport")
- Personalize the app with a built-in color picker. Choose from presets or use a custom Hex code.
- View balances for every account and your total net worth at a glance.
- Visualize spending with interactive charts, category breakdowns, net worth tracking, and monthly reports.
- Create custom spending categories with custom icons and colors.
- Mobile friendly UI.
& many more...

## Screenshots

A complete overview of your finances
<br>
<img width="1005" height="1885" alt="dark-dashboard" src="https://github.com/user-attachments/assets/494589d8-d36c-4be4-8f0f-c3af62144cae" />













Create accounts, categories, rules, update currency, customize & more
<br>
<img width="384" height="766" alt="image" src="https://github.com/user-attachments/assets/f7dea837-0c54-4c51-890a-67b60a9d3281" />
<img width="384" height="426" alt="image" src="https://github.com/user-attachments/assets/9ea3dffa-e15b-4594-931f-cc0911566744" />
<img width="384" height="574" alt="image" src="https://github.com/user-attachments/assets/550648be-d4bd-4e54-a018-dc11600676dd" />
<img width="384" height="484" alt="image" src="https://github.com/user-attachments/assets/e824aed0-18cf-435d-997d-01981ea28a8b" />





How to add a transaction?
<br>
<img width="370" height="384" alt="image" src="https://github.com/user-attachments/assets/ce7148d6-f69f-4bf2-9739-c5a211e7ed38" />
<br>
Well, press the "Add transaction" button. Then this dialog will appear. Here, type the name of the transaction (food, subscription, salary). Then select transaction type: either expense or income.
Select a category that you want to assign the transaction to and enter the amount of the transaction. Lastly, if your transaction is recurring (it's a subscription for example), then you select the recurring transaction button and
choose when does your transaction repeat. It can be daily, weekly, monthly, yearly.

Goals. When the user first launches the app, he will only see the "Create goal" button, after the goal is created, users can edit their goals & contribute to them. All contributions to goals can be seen in the contribution history.
<img width="1003" height="249" alt="image" src="https://github.com/user-attachments/assets/3daeb1e9-2f91-4250-99dd-ee3cf7e45343" />

Here you can see your recent transactions, search them by description, amount or category. Download a CSV file with all your transaction data or filter them by "Today", "This week", "This month", This year" or "All time"
<img width="1010" height="349" alt="image" src="https://github.com/user-attachments/assets/c6a2e904-25a6-48a8-a790-88e381408571" />

You can see your spending by category, a piechart & budget overview. In budget overview you can edit or set a budget limit. When nearing your budget limit, the color will change.
<img width="1020" height="818" alt="image" src="https://github.com/user-attachments/assets/ef079d2c-c6c3-4ab5-83b5-f1a629afaa3f" />

Built with:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- lucid-react
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
