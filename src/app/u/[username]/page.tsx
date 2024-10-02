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
import InteractiveBackground from '@/components/ui/InteractiveBackground'

export default function FuturisticMessageUI() {
    const { username } = useParams<{ username: string }>()
    const {
        complete,
        completion,
        isLoading: isSuggestLoading,
        error,
    } = useCompletion({ api: '/api/suggest-messages' })

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

        const animateElements = formRef.current?.querySelectorAll('.animate-in')
        if (animateElements) {
            tl.fromTo(
                animateElements,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out' },
                '-=0.5'
            )
        }

        const hoverAnimation = gsap.to(containerRef.current, {
            boxShadow: '0 0 30px rgba(66, 153, 225, 0.5)',
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
                <link rel="canonical" href={`https://tbhfeedback.live/u/${username}`} />
            </Head>
            <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-black">
                <InteractiveBackground />
                <div ref={containerRef} className="w-full max-w-4xl relative z-10">
                    <div className="bg-zinc-900/50 backdrop-blur-xl shadow-2xl rounded-3xl transition-all duration-300 p-10">
                        <h1 className="text-3xl md:text-3xl font-extrabold text-center text-white animate-in">
                            Send an Anonymous Message to 
                            <span className="text-purple-600/50"> @{username}</span>
                        </h1>
                        <p className="text-zinc-400 mb-6 text-center animate-in">
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
                                                        className="resize-none text-blue-100 bg-zinc-800 bg-opacity-50 border-2 border-gray-700 focus:border-purple-400 focus:ring-purple-400 rounded-2xl w-full h-40 p-4 pr-16 transition-all duration-300"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            setCharCount(e.target.value.length)
                                                        }}
                                                    />
                                                    <div className="absolute bottom-4 right-4 w-12 h-1 bg-gray-600 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gray-500 transition-all duration-300"
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
                                            className="bg-transparent text-purple-300 border-2 border-purple-500 font-semibold py-2 px-4 rounded-full transition-all duration-300 flex items-center group w-full md:w-auto hover:bg-purple-500 hover:text-white hover:shadow-lg hover:scale-105"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            Get Your Own
                                            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Button>
                                    </Link>

                                    <Button
                                        type="submit"
                                        disabled={isLoading || !messageContent}
                                        className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center group w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 hover:shadow-lg hover:scale-105'}`}
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
