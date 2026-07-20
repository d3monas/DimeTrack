# DimeTrack

A simple, open-source money tracker and savings planner.

## Features

- Track income & expenses, with ability to edit & delete
- Search and filter transactions by description, amount, category
- Ability to export your transactions to CSV
- Set savings goals and contribute towards them directly, with full contribution history
- Create custom categories & set budget limits, with warnings as you approach them
- Multi-currency support
- View account balance at a glance
- Spending breakdown by category & a pie chart

## Screenshots

At the top of the page you can see your current balance, income & expenses this month.
<img width="1034" height="120" alt="Screenshot 2026-06-18 144125" src="https://github.com/user-attachments/assets/f3ca9eeb-bb62-4cd5-9d2f-46132a740c66" />

These are the settings, here you can manage your categories (delete & create them), select your preferred currency and manage recurring transactions.
<br>
<img width="375" height="381" alt="image" src="https://github.com/user-attachments/assets/7fc7008e-0026-43d7-8e7e-6e69a500469c" />

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

## How it works

DimeTrack helps you to understand where your money is going and contribute to your savings goals. It runs entirely in your browser - no accounts, no servers & no subscriptions.
All your data is stored locally in your local storage and never leaves your device. 

Built with:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- lucid-react
- react-colorful
- colord

Check it out here: https://dime-track.vercel.app/

## Running locally

Want to run DimeTrack locally? Not a problem!:

- `git clone https://github.com/d3monas/dimetrack.git`
- `cd dimetrack`
- `npm install`
- `npm run dev`

Then open http://localhost:3000 in your browser.
> NOTE: some features rely on `crypto.randomUUID()`, which requires a secure context. This works while testing on `localhost`, but if you are testing on another device over
> your local network, use a tool like Vercel to test over HTTPS, because features like adding transactions will not work.
