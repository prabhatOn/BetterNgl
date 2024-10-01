'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Send, ChevronRight, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompletion } from 'ai/react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import * as z from 'zod'
import { ApiResponse } from '@/types/ApiResponse'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { messageSchema } from '@/schemas/messageSchema'
import { gsap } from 'gsap'
import Head from 'next/head'

const InteractiveBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let blobs: { x: number; y: number; radius: number; color: string; vx: number; vy: number }[] = []
        const mouse = { x: 0, y: 0 }

        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            initBlobs()
        }

        const initBlobs = () => {
            blobs = []
            const blobCount = 5
            for (let i = 0; i < blobCount; i++) {
                blobs.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 100 + 50,
                    color: `hsla(${Math.random() * 60 + 180}, 70%, 60%, 0.3)`,
                    vx: Math.random() * 2 - 1,
                    vy: Math.random() * 2 - 1,
                })
            }
        }

        const drawBlobs = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            blobs.forEach((blob, index) => {
                ctx.beginPath()
                ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
                ctx.fillStyle = blob.color
                ctx.fill()

                blob.x += blob.vx
                blob.y += blob.vy

                if (blob.x < 0 || blob.x > canvas.width) blob.vx *= -1
                if (blob.y < 0 || blob.y > canvas.height) blob.vy *= -1

                const dx = mouse.x - blob.x
                const dy = mouse.y - blob.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < 200) {
                    const angle = Math.atan2(dy, dx)
                    blob.vx -= Math.cos(angle) * 0.2
                    blob.vy -= Math.sin(angle) * 0.2
                }

                // Interact with other blobs
                blobs.forEach((otherBlob, otherIndex) => {
                    if (index !== otherIndex) {
                        const dx = otherBlob.x - blob.x
                        const dy = otherBlob.y - blob.y
                        const distance = Math.sqrt(dx * dx + dy * dy)
                        if (distance < blob.radius + otherBlob.radius) {
                            const angle = Math.atan2(dy, dx)
                            blob.vx -= Math.cos(angle) * 0.1
                            blob.vy -= Math.sin(angle) * 0.1
                            otherBlob.vx += Math.cos(angle) * 0.1
                            otherBlob.vy += Math.sin(angle) * 0.1
                        }
                    }
                })

                // Apply friction
                blob.vx *= 0.99
                blob.vy *= 0.99
            })

            animationFrameId = requestAnimationFrame(drawBlobs)
        }

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX
            mouse.y = event.clientY
        }

        window.addEventListener('resize', resizeCanvas)
        window.addEventListener('mousemove', handleMouseMove)

        resizeCanvas()
        drawBlobs()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
}

export default function FuturisticMessageUI() {
    const { username } = useParams<{ username: string }>()

    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
    } = useCompletion({
        api: '/api/suggest-messages',
    })

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    })

    const messageContent = form.watch('content')
    const [isLoading, setIsLoading] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const [showSparkles, setShowSparkles] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const onSubmit = useCallback(async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            })

            toast({
                title: 'Message Sent',
                description: response.data.message,
                variant: 'default',
            })
            form.reset({ ...form.getValues(), content: '' })
            setCharCount(0)
            setShowSparkles(true)
            setTimeout(() => setShowSparkles(false), 2000)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to send message',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }, [form, username])

    useEffect(() => {
        const tl = gsap.timeline()

        tl.fromTo(
            containerRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )

        const animateElements = formRef.current?.querySelectorAll('.animate-in');
        if (animateElements) {
            tl.fromTo(
                animateElements,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' },
                '-=0.5'
            );
        }

        const hoverAnimation = gsap.to(containerRef.current, {
            boxShadow: '0 0 30px rgba(66, 153, 225, 0.3)',
            duration: 0.3,
            paused: true,
        })

        const handleMouseEnter = () => hoverAnimation.play()
        const handleMouseLeave = () => hoverAnimation.reverse()

        containerRef.current?.addEventListener('mouseenter', handleMouseEnter)
        containerRef.current?.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            containerRef.current?.removeEventListener('mouseenter', handleMouseEnter)
            containerRef.current?.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [])

    return (
        <>
            <Head>
                <title>Send an Anonymous Message to @{username}</title>
                <meta name="description" content="Send anonymous messages to your friends while keeping your identity secret. Make an impact with your words!" />
                <meta name="keywords" content="anonymous messaging, send messages, secret messages, communication, privacy, interactive UI" />
                <meta name="author" content="Prabhat Chaubey" />
                <link rel="canonical" href={`https://tbh.techxavvy.in/u/${username}`} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        name: `Send an Anonymous Message to ${username}`,
                        description: "Send anonymous messages to your friends while keeping your identity secret.",
                        url: `https://tbh.techxavvy.in/u/${username}`,
                        author: {
                            "@type": "Person",
                            name: "Prabhat Chaubey",
                        },
                    })}
                </script>
            </Head>
            <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gray-900">
                <InteractiveBackground />
                <div ref={containerRef} className="w-full max-w-4xl relative z-10">
                    <div className="bg-gray-800 bg-opacity-40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
                        <div className="p-8 md:p-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center text-blue-300 animate-in">
                                Send an anonymous Message to
                                <br />
                                <span className="text-blue-500">@{username}</span>
                            </h1>
                            <p className="text-gray-300 mb-8 text-center animate-in">
                                Share your thoughts anonymously and make your words count.
                            </p>
                            <Form {...form}>
                                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem className="animate-in">
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Textarea
                                                            placeholder="Type your anonymous message here..."
                                                            className="resize-none text-blue-100 bg-gray-700 bg-opacity-50 border-2 border-blue-500 focus:border-blue-400 focus:ring-blue-400 rounded-2xl w-full h-40 p-4 pr-16 transition-all duration-300"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                setCharCount(e.target.value.length);
                                                            }}
                                                        />
                                                        <div className="absolute bottom-4 right-4 w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 transition-all duration-300"
                                                                style={{ width: `${(charCount / 500) * 100}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-col md:flex-row justify-between items-center animate-in space-y-4 md:space-y-0">
                                        <Link href={'/sign-up'}>
                                            <Button
                                                variant="outline"
                                                className="bg-transparent text-blue-300 border-2 border-blue-500 font-semibold py-2 px-4 rounded-full transition-all duration-300 flex items-center group w-full md:w-auto hover:bg-blue-500 hover:text-white hover:shadow-lg hover:scale-105"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                Get Your Own
                                                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </Button>
                                        </Link>



                                        <Button
                                            type="submit"
                                            disabled={isLoading || !messageContent}
                                            className={`bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center group w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500'}`}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="mr-2">Send</span>
                                                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
                {showSparkles && (
                    <div className="fixed inset-0 pointer-events-none z-50">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <Sparkles className="text-yellow-400 animate-ping" size={48} />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}