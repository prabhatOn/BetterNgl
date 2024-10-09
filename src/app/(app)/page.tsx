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

    const handleBeforeInstallPrompt = useCallback((e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPrompt(true);
    }, []);

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
        };
    }, [handleBeforeInstallPrompt]);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
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
            {/* Meta Tags for SEO */}
            <Head>
                <meta name="description" content="TBH is a revolutionary platform that ensures privacy and security when sharing or receiving honest feedback. Join today to start sharing anonymously." />
                <meta name="keywords" content="anonymous feedback, private feedback, secure feedback platform, TBH app" />
                <meta property="og:title" content="TBH - Honest Anonymous Feedback" />
                <meta property="og:description" content="Securely share and receive anonymous feedback with complete privacy and trust." />
                <meta property="og:image" content="/path/to/image.jpg" />
                <meta property="og:url" content="https://yourwebsite.com" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="TBH - Honest Anonymous Feedback" />
                <meta name="twitter:description" content="Revolutionizing anonymous feedback by providing ultimate privacy and security." />
                <meta name="twitter:image" content="/path/to/image.jpg" />
                <title>TBH - Honest, Anonymous Feedback with Security</title>
            </Head>

            {/* Hero Section */}
            <section className="text-center py-16">
                <h1 className="text-4xl font-bold text-white mb-4">Get Honest, Anonymous Feedback Securely</h1>
                <p className="text-zinc-400 max-w-xl mx-auto mb-8">
                    Securely share and receive genuine feedback with guaranteed privacy. TBH ensures your identity stays protected.
                </p>
                <Button onClick={handleButtonClick} className="bg-blue-600 px-6 py-3 text-lg rounded-md hover:bg-blue-700">
                    {loading ? <Loader className="animate-spin" /> : "Start Sharing Now"}
                </Button>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-8">
                <FeatureCard
                    title="Secure & Private Feedback"
                    description="Advanced encryption ensures complete anonymity and data privacy."
                />
                <FeatureCard
                    title="True Honest Feedback"
                    description="Foster an environment that encourages open, authentic communication."
                />
                <FeatureCard
                    title="Seamless User Experience"
                    description="Designed for easy interaction, making sharing thoughts effortless."
                />
            </section>

            {/* Example Messages */}
            <section className="px-4 py-8 bg-zinc-900/50">
                <h2 className="text-2xl font-semibold text-white mb-4">Examples of Honest Feedback</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ExampleMessage content="Great presentation, though adding specific examples could make your points clearer." />
                    <ExampleMessage content="Your effort is appreciated! Improving team communication could elevate your performance." />
                </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-16 bg-zinc-800">
                <h2 className="text-3xl font-bold text-white mb-4">Ready for True Honest Feedback?</h2>
                <p className="text-zinc-400 max-w-xl mx-auto mb-8">
                    Sign up today and safely share what really matters—privately and securely.
                </p>
                <Button onClick={handleButtonClick} className="bg-green-600 px-6 py-3 text-lg rounded-md hover:bg-green-700">
                    {loading ? <Loader className="animate-spin" /> : "Join TBH Now"}
                </Button>
            </section>

            {/* Install Prompt */}
            {showInstallPrompt && (
                <div className="fixed bottom-4 left-4 z-50 bg-zinc-800 p-4 rounded-lg shadow-lg">
                    <p className="text-zinc-200 mb-4">Install TBH for a better experience.</p>
                    <Button onClick={handleInstallClick} className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700">
                        Install TBH
                    </Button>
                </div>
            )}

            <footer className="relative z-10 px-4 py-6 text-center text-zinc-500 border-t border-zinc-800">
                <p className="font-body">
                    © 2024 TBH. Revolutionizing how you share thoughts and feelings anonymously.
                </p>
            </footer>
        </div>
    );
}
