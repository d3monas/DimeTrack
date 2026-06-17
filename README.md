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

## How it works

DimeTrack helps you to understand where your money is going and contribute to your savings goals. It runs entirely in your browser - no accounts, no servers & no subscriptions.
All your data is stored locally in your local storage and never leaves your device. 

Built with:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

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
