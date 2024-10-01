"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
    <div className="rounded-lg bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-300 hover:bg-zinc-800/50">
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
        <p className="text-zinc-400">{description}</p>
    </div>
)

const ExampleMessage = ({ content }: { content: string }) => (
    <div className="rounded-lg bg-zinc-800/50 backdrop-blur-sm p-4 text-zinc-300">
        {content}
    </div>
)

const BackgroundAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const drawDot = (x: number, y: number, radius: number, color: string) => {
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
        }

        const animate = () => {
            time += 0.005
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const text = 'TBH'
            ctx.font = `bold ${canvas.width * 0.4}px Orbitron`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)')  // blue-500 with low opacity
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)')  // purple-500 with low opacity
            ctx.fillStyle = gradient

            ctx.fillText(text, canvas.width / 2, canvas.height / 2)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let y = 0; y < imageData.height; y += 10) {
                for (let x = 0; x < imageData.width; x += 10) {
                    const i = (y * imageData.width + x) * 4
                    if (imageData.data[i + 3] > 128) {
                        drawDot(x, y, 1, `rgba(${imageData.data[i]}, ${imageData.data[i + 1]}, ${imageData.data[i + 2]}, 0.5)`)
                    }
                }
            }

            // Animated light following the dotted text
            const pathLength = canvas.width * 1.5
            const currentPos = (time % 1) * pathLength
            const x = (currentPos < canvas.width)
                ? currentPos
                : canvas.width - (currentPos - canvas.width)
            const y = canvas.height / 2 + Math.sin(currentPos * 0.01) * 50

            ctx.beginPath()
            ctx.arc(x, y, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
            ctx.fill()

            ctx.beginPath()
            ctx.arc(x, y, 15, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
            ctx.fill()

            animationFrameId = requestAnimationFrame(animate)
        }

        resize()
        animate()

        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />
}

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <BackgroundAnimation />
            <section className="px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative">
                <div className="mx-auto max-w-6xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-display">
                        Honesty Redefined
                    </h1>
                    <p className="mb-10 text-xl text-zinc-400 sm:text-2xl font-body">
                        Share and receive genuine feedback with unparalleled privacy and security.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                        <Link href="/sign-up" className="flex items-center">
                            Get started
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="px-4 py-16 md:py-24 bg-zinc-950/50 backdrop-blur-sm">
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

            <section className="px-4 py-16 md:py-24">
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

            <section className="px-4 py-16 md:py-24 bg-zinc-950/50 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-3xl font-bold sm:text-4xl font-display">
                        Ready to Embrace Honesty?
                    </h2>
                    <p className="mb-10 text-xl text-zinc-400 font-body">
                        Join TBH today and start sharing your thoughts freely and securely.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                        <Link href="/sign-up" className="flex items-center">
                            Create Your Account
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            <footer className="px-4 py-6 text-center text-zinc-500 border-t border-zinc-800">
                <p className="font-body">
                    © 2024 TBH. Revolutionizing how you share thoughts and feelings anonymously.
                </p>
            </footer>
        </div>
    )
}