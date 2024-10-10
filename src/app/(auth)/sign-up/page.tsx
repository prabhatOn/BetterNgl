'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, UserPlus, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { gsap } from 'gsap';
import InteractiveBackground from '@/components/ui/InteractiveBackground';
import Head from 'next/head';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debouncedUsername = useDebounce(username, 300);

    const router = useRouter();
    const { toast } = useToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    // SEO and meta tags
    useEffect(() => {
        document.title = 'Sign Up | TBH';
    }, []);

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage(''); // Reset message
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-username-unique?username=${debouncedUsername}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? 'Error checking username'
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);

            toast({
                title: 'Success',
                description: response.data.message,
            });

            router.replace(`/verify/${username}`);

            setIsSubmitting(false);
        } catch (error) {
            console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;

            let errorMessage = axiosError.response?.data.message ?? 'There was a problem with your sign-up. Please try again.';

            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant: 'destructive',
            });

            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(
            containerRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );

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
        });

        const handleMouseEnter = () => hoverAnimation.play();
        const handleMouseLeave = () => hoverAnimation.reverse();

        containerRef.current?.addEventListener('mouseenter', handleMouseEnter);
        containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
            containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <>
            <Head>
                <meta name="description" content="Sign up to TBH for anonymous messaging, secret conversations, and a futuristic interactive experience. Start your anonymous adventure now." />
                <meta name="keywords" content="Sign Up, Anonymous Messaging, Secret Conversations, TBH App, Interactive UI" />
                <meta property="og:title" content="Sign Up | TBH" />
                <meta property="og:description" content="Join TBH and start your anonymous adventure. Sign up now for secret conversations with an interactive experience." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.tbhfeedback.live/sign-up" />
                <meta property="og:image" content="/public/favicon.png" />
            </Head>

            <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-black text-white">
                <InteractiveBackground />
                <div ref={containerRef} className="w-full max-w-md relative z-10">
                    <div className="bg-zinc-900/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
                        <div className="p-8 md:p-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center font-display animate-in">
                                Join TBH
                            </h1>
                            <p className="text-zinc-400 mb-8 text-center font-body animate-in">
                                Sign up to start your anonymous adventure
                            </p>
                            <Form {...form}>
                                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        name="username"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="animate-in">
                                                <FormLabel className="text-white">Username</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            setUsername(e.target.value);
                                                        }}
                                                        className="bg-zinc-800/50 border-2 border-gray-500 text-white focus:ring-blue-500 rounded-xl"
                                                    />
                                                </FormControl>
                                                {isCheckingUsername && <Loader2 className="animate-spin text-white" />}
                                                {!isCheckingUsername && usernameMessage && (
                                                    <p
                                                        className={`text-sm ${usernameMessage === 'Username is unique'
                                                            ? 'text-green-400'
                                                            : 'text-red-400'
                                                            }`}
                                                    >
                                                        {usernameMessage}
                                                    </p>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="email"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="animate-in">
                                                <FormLabel className="text-white">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="bg-zinc-800/50 border-2 border-gray-500 text-white focus:ring-blue-500 rounded-xl"
                                                    />
                                                </FormControl>
                                                <p className="text-zinc-400 text-sm">
                                                    We will send you a verification code
                                                </p>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="password"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="animate-in">
                                                <FormLabel className="text-white">Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        className="bg-zinc-800/50 border-2 border-gray-500 text-white focus:ring-blue-500 rounded-xl"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full flex justify-center items-center space-x-2 animate-in bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
                                        <span>{isSubmitting ? 'Submitting' : 'Sign Up'}</span>
                                    </Button>
                                </form>
                            </Form>
                            <div className="text-center mt-6 text-zinc-400 animate-in">
                                Already have an account?{' '}
                                <Link href="/login" className="underline">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
