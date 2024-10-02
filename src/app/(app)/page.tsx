"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
    <div className="relative z-10 rounded-lg bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-zinc-800/50">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-zinc-400">{description}</p>
    </div>
)

const ExampleMessage = ({ content }: { content: string }) => (
    <div className="relative z-10 rounded-lg bg-zinc-800/50 backdrop-blur-sm p-4 text-zinc-300">
        {content}
    </div>
)

export default function Home() {
    const [loading, setLoading] = useState(false)

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate a loading delay (e.g., API request)
        setTimeout(() => {
            setLoading(false)
            // Redirect or perform action here
        }, 2000) // 2-second delay
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans relative">
            <section className="relative z-10 px-4 pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-display">
                        Honesty Redefined
                    </h1>
                    <p className="mb-10 text-xl text-zinc-400 sm:text-2xl font-body">
                        Share and receive genuine feedback with unparalleled privacy and security.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        onClick={handleButtonClick}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Loading...
                            </div>
                        ) : (
                            <Link href="/sign-up" className="flex items-center">
                                Get started
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        )}
                    </Button>
                </div>
            </section>

            <section className="relative z-10 px-4 py-16 md:py-24 bg-zinc-950/50 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl font-display">
                        Why Choose TBH?
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <FeatureCard
                            title="Enhanced Privacy"
                            description="State-of-the-art encryption and anonymity features to protect your identity."
                        />
                        <FeatureCard
                            title="Honest Feedback"
                            description="Create an environment where people feel safe to share their true thoughts."
                        />
                        <FeatureCard
                            title="User-Friendly"
                            description="Intuitive interface designed for seamless interaction and communication."
                        />
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-16 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl font-display">
                        Experience True Honesty
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <ExampleMessage content="Your presentation was insightful, but I think it could benefit from more concrete examples." />
                        <ExampleMessage content="I appreciate your hard work, but I feel there's room for improvement in team communication." />
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-16 md:py-24 bg-zinc-950/50 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-3xl font-bold sm:text-4xl font-display">
                        Ready to Embrace Honesty?
                    </h2>
                    <p className="mb-10 text-xl text-zinc-400 font-body">
                        Join TBH today and start sharing your thoughts freely and securely.
                    </p>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                        onClick={handleButtonClick}
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                Loading...
                            </div>
                        ) : (
                            <Link href="/sign-up" className="flex items-center">
                                Create Your Account
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        )}
                    </Button>
                </div>
            </section>

            <footer className="relative z-10 px-4 py-6 text-center text-zinc-500 border-t border-zinc-800">
                <p className="font-body">
                    © 2024 TBH. Revolutionizing how you share thoughts and feelings anonymously.
                </p>
            </footer>
        </div>
    )
}
