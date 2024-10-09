'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { gsap } from 'gsap';
import { Loader2, CheckCircle } from 'lucide-react';
import InteractiveBackground from '@/components/ui/InteractiveBackground';
import Link from 'next/link';
import React from 'react';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast({
                title: 'Success',
                description: response.data.message,
            });

            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Verification Failed',
                description:
                    axiosError.response?.data.message ?? 
                    'An error occurred. Please try again.',
                variant: 'destructive',
            });
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
            <head>
                <title>Verify Your Account | [Website Name]</title>
                <meta name="description" content="Verify your account on [Website Name]. Enter the verification code sent to your email to secure your account." />
                <meta property="og:title" content="Verify Your Account on [Website Name]" />
                <meta property="og:description" content="Secure your account by entering the verification code sent to your email." />
                <meta property="og:url" content="[URL of this page]" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                {`{
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "name": "Verify Your Account",
                  "description": "Enter the verification code sent to your email to verify your account on [Website Name].",
                  "url": "[URL of this page]"
                }`}
                </script>
            </head>
            <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-black">
                <InteractiveBackground />
                <div ref={containerRef} className="w-full max-w-md relative z-10">
                    <div className="bg-zinc-900/50 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
                        <div className="p-8 md:p-12">
                            <h1 className="text-4xl md:text-4xl font-bold mb-6 leading-tight text-center text-white animate-in">
                                Verify Your Account
                            </h1>
                            <h2 className="text-gray-300 mb-8 text-center animate-in">
                                Enter the verification code sent to your email
                            </h2>
                            <Form {...form}>
                                <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                        name="code"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem className="animate-in">
                                                <FormLabel className="text-gray-300">Verification Code</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        className="bg-zinc-900/50 bg-opacity-50 border-2 border-gray-500 focus:border-blue-400 focus:ring-blue-400 text-blue-100 rounded-xl"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group hover:from-blue-500 hover:to-purple-500 ${form.formState.isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        disabled={form.formState.isSubmitting}
                                    >
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-label="Loading icon" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <span className="mr-2">Verify</span>
                                                <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" aria-label="Verification success icon" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                            <p className="text-center text-gray-400 mt-4">
                                Didn't receive a code?{' '}
                                <Link href="/resend-code" className="text-blue-500 hover:underline">
                                    Resend the code
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


