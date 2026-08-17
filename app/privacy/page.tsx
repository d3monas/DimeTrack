export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl p-4 sm:p-6">
                <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
                <hr />

                <div className="space-y-6 mt-3 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold mb-2">Overview</h2>
                        <p>
                            By default, DimeTrack does not collect or store any of your personal data to any server. 
                            Everything you enter, including: transactions, budgets, categories and savings goals, stays on your device only.
                            DimeTrack does not require an account, we do not collect personal data to use the core application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Optional Cloud Sync</h2>
                        <p>
                            DimeTrack offers an optional "Cloud Sync" feature allowing you to back up your data and access it across multiple devices.
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Your data is encrypted end-to-end in your browser before it is sent to our servers.</li>
                            <li>We never receive your passowrds, meaning there is no way to decrypt or read your data.</li>
                            <li>Any encrypted sync data that goes un-updated for 30 days is automatically and permanently deleted.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-2">Analytics</h2>
                        <p>
                            DimeTrack uses Vercel analytics to track anonymized usage data, such as page views and traffic sources.
                            This service does not use cookies and does not collect any personal data. No content that you enter into the app is ever included in the analytics. 
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}