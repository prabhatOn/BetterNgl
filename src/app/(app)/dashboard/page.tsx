'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Share2 } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { gsap } from 'gsap';
import InteractiveBackground from '@/components/ui/InteractiveBackground';
function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { toast } = useToast();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to fetch message settings',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast({
                        title: 'Refreshed Messages',
                        description: 'Showing latest messages',
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Error',
                    description:
                        axiosError.response?.data.message ?? 'Failed to fetch messages',
                    variant: 'destructive',
                });
            } finally {
                setIsLoading(false);
            }
        },
        [toast]
    );

    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessages();

        // Background animation (optional)
        const bgAnimation = gsap.fromTo(
            containerRef.current,
            { backgroundColor: '#000' },
            {
                backgroundColor: '#111',
                duration: 3,
                yoyo: true,
                repeat: -1,
                ease: 'power1.inOut',
            }
        );

        return () => {
            bgAnimation.kill();
        };
    }, [session, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', !acceptMessages);
            toast({
                title: response.data.message,
                variant: 'default',
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ??
                    'Failed to update message settings',
                variant: 'destructive',
            });
        }
    };

    if (!session || !session.user) {
        return <div></div>;
    }

    const { username } = session.user as User;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'URL Copied!',
            description: 'Profile URL has been copied to clipboard.',
        });
    };

    const shareProfile = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Check out my TBH profile!',
                    url: profileUrl,
                });
            } else {
                copyToClipboard();
            }
        } catch (error) {
            console.error('Sharing failed', error);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 font-sans"
        >
           <InteractiveBackground />
            <div className="max-w-5xl mx-auto bg-zinc-900/50 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 sm:p-10">
                    <h1 className="text-4xl font-bold mb-8 text-white font-display">
                        User Dashboard
                    </h1>

                    {/* Unique Link Section */}
                    <div className="mb-10 bg-zinc-800/50 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-white font-display">
                            Your Unique Link
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="flex-grow p-3 bg-zinc-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-body"
                            />
                            <div className="flex space-x-2">
                                <Button
                                    onClick={copyToClipboard}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-200"
                                >
                                    <Copy className="w-5 h-5 mr-2" />
                                    Copy
                                </Button>
                                <Button
                                    onClick={shareProfile}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-200"
                                >
                                    <Share2 className="w-5 h-5 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Accept Messages Switch */}
                    <div className="mb-10 flex items-center justify-between bg-zinc-800/50 p-6 rounded-lg">
                        <div className="flex items-center space-x-4">
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                                className="data-[state=checked]:bg-blue-500"
                            />
                            <span className="text-lg font-medium text-white font-body">
                                Accept Messages: {acceptMessages ? 'On' : 'Off'}
                            </span>
                        </div>
                        {isSwitchLoading && (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        )}
                    </div>

                    <Separator className="my-8 bg-zinc-700" />

                    {/* Messages Section */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-white font-display">
                            Your Messages
                        </h2>
                        <Button
                            onClick={() => fetchMessages(true)}
                            variant="outline"
                            className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-md flex items-center transition duration-200"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <RefreshCcw className="w-5 h-5 mr-2" />
                            )}
                            Refresh
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <MessageCard
                                    key={message._id}
                                    message={message}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))
                        ) : (
                            <p className="col-span-2 text-center text-zinc-400 py-8 font-body">
                                No messages to display.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
