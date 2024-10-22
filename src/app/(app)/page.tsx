"use client";

import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
    <div className="relative z-10 rounded-lg bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-zinc-800/50">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-zinc-400">{description}</p>
    </div>
);

const ExampleMessage = ({ content }: { content: string }) => (
    <div className="relative z-10 rounded-lg bg-zinc-800/50 backdrop-blur-sm p-4 text-zinc-300">
        {content}
    </div>
);

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    // Define the event handler as a stable reference
    const handleBeforeInstallPrompt = useCallback((e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
    }, []);

    useEffect(() => {
        // Listen for the beforeinstallprompt event
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
        };
    }, [handleBeforeInstallPrompt]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setShowInstallPrompt(false);
        }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans relative">
            {/* SEO Header */}
            <Head>
                <title>TBH: Real Feedback from Real People</title>
                <meta name="description" content="Join TBH and experience real, anonymous feedback with top-tier privacy and security features." />
                <meta name="keywords" content="anonymous feedback, real opinions, anonymous sharing, thoughts, tbh app, ngl alternative, tbh feedback, anonymous messaging, privacy feedback app, real feedback" />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="TBH:Feedback" />
                <meta property="og:title" content="TBH: Real Feedback from Real People" />
                <meta property="og:description" content="Join TBH and experience real, anonymous feedback with top-tier privacy and security features." />
                <meta property="og:url" content="https://tbhfeedback.live" />
                <meta property="og:image" content="https://tbhfeedback.live/favicon.png" />
                <meta property="og:type" content="website" />

                {/* Twitter Card metadata */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:title" content="TBH: Real Feedback from Real People" />
                <meta property="twitter:description" content="Join TBH and experience real, anonymous feedback with top-tier privacy and security features." />
                <meta property="twitter:image" content="https://tbhfeedback.live/favicon.png" />
                <link rel="canonical" href="https://tbhfeedback.live" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "TBH: Real Feedback from Real People",
                            "description": "Join TBH and experience real, anonymous feedback with top-tier privacy and security features.",
                            "url": "https://tbhfeedback.live",
                            "image": "https://tbhfeedback.live/favicon.png",
                            "publisher": {
                                "@type": "Organization",
                                "name": "TBH Feedback",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://tbhfeedback.live/favicon.png",
                                },
                            },
                        }),
                    }}
                />
            </Head>


            <section className="relative z-10 px-4 pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-display">
                        Discover Authentic Feedback with TBH: Your Trusted Platform for Honest Conversations
                    </h1>
                    <p className="mb-10 text-xl text-zinc-400 sm:text-2xl font-body">
                        Join TBH and experience real, anonymous feedback with top-tier privacy and security features. Share your thoughts and opinions, and get unfiltered, authentic responses from your peers or followers.
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
                        Why TBH is the Best Platform for Anonymous, Secure, and Honest Feedback
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <FeatureCard
                            title="Enhanced Privacy & Security"
                            description="Advanced encryption technology and anonymity tools to safeguard your identity online."
                        />
                        <FeatureCard
                            title="Honest and Unbiased Feedback"
                            description="Foster a space where users feel empowered to share their genuine thoughts without fear of judgment."
                        />
                        <FeatureCard
                            title="User-Friendly Design"
                            description="Enjoy an intuitive, easy-to-use interface crafted for seamless communication and feedback sharing."
                        />
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-16 md:py-24">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl font-display">
                        Real-World Honest Feedback You Can Use for Personal Growth
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <ExampleMessage content="Your presentation was engaging and insightful; however, incorporating more concrete examples could make it even more impactful." />
                        <ExampleMessage content="I truly appreciate your hard work. That said, enhancing communication within the team would boost overall efficiency and collaboration." />
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-4 py-16 md:py-24 bg-zinc-950/50 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-3xl font-bold sm:text-4xl font-display">
                        Ready to Receive Honest, Unfiltered Feedback? Start Now!
                    </h2>
                    <p className="mb-10 text-xl text-zinc-400 font-body">
                        Sign up for TBH and begin sharing your thoughts and opinions with full privacy and anonymity. Experience the power of real feedback that helps you grow and improve.
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

            {/* Install Prompt Section */}
            {showInstallPrompt && (
                <div className="fixed bottom-4 right-4 z-20 p-4 bg-zinc-800 rounded-lg shadow-lg">
                    <p className="text-white mb-2">Want to install the TBH app?</p>
                    <Button onClick={handleInstallClick} className="bg-blue-600">
                        Install
                    </Button>
                </div>
            )}

            <footer className="relative z-10 px-4 py-6 text-center text-zinc-500 border-t border-zinc-800">
                <p className="font-body">
                    © 2024 TBH. TBH is transforming the way people share their thoughts, opinions, and feelings anonymously. Join the revolution in anonymous feedback today and see how authentic communication can drive personal growth.
                </p>
            </footer>
        </div>
    );
}