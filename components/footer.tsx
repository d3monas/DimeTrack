import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t mt-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} DimeTrack. Made by <a href="https://github.com/d3monas" target="_blank" rel="noopener noreferrer" className="hover:underline">d3monas.</a></p>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </div>
        </footer>
    )
}