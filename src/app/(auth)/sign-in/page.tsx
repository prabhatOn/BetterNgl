'use client';

import React, { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { gsap } from 'gsap';
import { Loader2, LogIn, ChevronRight } from 'lucide-react';
import InteractiveBackground from '@/components/ui/InteractiveBackground'; // Import your separate component

export default function SignInForm() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const { toast } = useToast();
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
                toast({
                    title: 'Login Failed',
                    description: 'Incorrect username or password',
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        }

        if (result?.url) {
            router.replace('/dashboard');
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
        <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gray-900">
            <InteractiveBackground />
            <div ref={containerRef} className="w-full max-w-md relative z-10">
                <div className="bg-gray-800 bg-opacity-40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transition-all duration-300">
                    <div className="p-8 md:p-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-center text-blue-300 animate-in">
                            Welcome Back to TBH
                        </h1>
                        <p className="text-gray-300 mb-8 text-center animate-in">
                            Sign in to continue your secret conversations
                        </p>
                        <Form {...form}>
                            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    name="identifier"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="animate-in">
                                            <FormLabel className="text-blue-300">Email/Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    className="bg-gray-700 bg-opacity-50 border-2 border-blue-500 focus:border-blue-400 focus:ring-blue-400 text-blue-100 rounded-xl"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="animate-in">
                                            <FormLabel className="text-blue-300">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    {...field}
                                                    className="bg-gray-700 bg-opacity-50 border-2 border-blue-500 focus:border-blue-400 focus:ring-blue-400 text-blue-100 rounded-xl"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group hover:bg-blue-500"
                                    type="submit"
                                >
                                    <span className="mr-2">Sign In</span>
                                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center mt-6 animate-in">
                            <p className="text-gray-300">
                                Not a member yet?{' '}
                                <Link href="/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center justify-center group">
                                    <span>Sign up</span>
                                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
