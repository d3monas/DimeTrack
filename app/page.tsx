"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Wallet, Target, PieChart, RefreshCw, ShieldCheck, Download } from "lucide-react"
import { ThemeToggle } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

const features = [
    {
        icon: Wallet,
        title: "Track income & expenses",
        description: "Add, edit and search transactions with categories and budgets."
    },
    {
        icon: Target,
        title: "Savings goals",
        description: "Set a goal, contribute towards it and see your progress with contribution history."
    },
    {
        icon: PieChart,
        title: "Spending insights",
        description: "See where your money goes with category breakdowns and a visual spending chart."
    },
    {
        icon: RefreshCw,
        title: "Recurring transactions",
        description: "Add recurring transactions with a daily, weekly, monthly, yearly or custom intervals."
    },
    {
        icon: ShieldCheck,  
        title: "Private and secure",
        description: "DimeTrack doesn't use accounts, servers or cloud. Everything stays in your browsers local storage."
    },
    {
        icon: Download,
        title: "Exportable data",
        description: "Export your transactions to CSV at any time."
    }
]

export default function LandingPage() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const screenshotSrc = mounted && resolvedTheme === "dark" ? "/dashboard-dark.png" : "/dashboard-light.png"

    return (
        <main className="relative overflow-hidden min-h-screen bg-background">

            <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>

            <section className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center sm:px-6">
                <h1 className="text-4xl font-bold tracking-light sm:text-5xl md:text-6xl">Money tracking, <br/>made simple.</h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    DimeTrack is a free, open-source money tracker and savings planner. No accounts, servers or subscriptions.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button size="lg" asChild>
                        <Link href="/app">Open DimeTrack</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <a href="https://github.com/d3monas/dimetrack" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                    </Button>
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 pb-20 relative z-10 sm:px-6">
                <div className="overflow-hidden shadow-lg">
                    <Image key={screenshotSrc} src={screenshotSrc} alt="DimeTrack dashboard" width={1742} height={1040} className="w-full h-auto block" priority />
                </div>
            </section>

            <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
                <h2 className="text-center text-3xl font-bold sm:text-4xl">Features</h2>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {features.map((feature) => {
                        return (
                            <div key={feature.title} className="rounded-2xl border p-6 transition-colors hover:border-foreground/20">
                                <feature.icon className="h-6 w-6 text-primary" />
                                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}