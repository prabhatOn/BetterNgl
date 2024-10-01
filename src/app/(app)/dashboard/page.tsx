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
import { Loader2, RefreshCcw, Copy, Link as LinkIcon } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { gsap } from 'gsap';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);

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

        // Background animation
        const bg = document.createElement('div');
        bg.style.position = 'fixed';
        bg.style.top = '0';
        bg.style.left = '0';
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.zIndex = '-1';
        document.body.appendChild(bg);

        const animate = () => {
            const colors = ['#f0f4f8', '#d9e2ec', '#bcccdc'].map(color => 
                gsap.utils.random(color, gsap.utils.colorLuminance(color, 0.2))
            );
            gsap.to(bg, {
                background: `linear-gradient(45deg, ${colors.join(', ')})`,
                duration: 10,
                ease: 'none',
                repeat: -1,
                yoyo: true
            });
        };

        animate();

        return () => {
            document.body.removeChild(bg);
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

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 sm:p-10">
                    <h1 className="text-4xl font-bold mb-6 text-gray-800">User Dashboard</h1>

                    <div className="mb-8 bg-gray-100 p-6 rounded-lg shadow-inner">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Unique Link</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={profileUrl}
                                readOnly
                                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={copyToClipboard}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md transition duration-200 ease-in-out flex items-center"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div className="mb-8 flex items-center justify-between bg-gray-100 p-6 rounded-lg shadow-inner">
                        <div className="flex items-center space-x-4">
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                                className="data-[state=checked]:bg-blue-500"
                            />
                            <span className="text-lg font-medium text-gray-700">
                                Accept Messages: {acceptMessages ? 'On' : 'Off'}
                            </span>
                        </div>
                        {isSwitchLoading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                    </div>

                    <Separator className="my-8" />

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Your Messages</h2>
                        <Button
                            onClick={() => fetchMessages(true)}
                            variant="outline"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition duration-200 ease-in-out flex items-center"
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <RefreshCcw className="w-4 h-4 mr-2" />
                            )}
                            Refresh
                        </Button>
                    </div>

                    <div ref={messagesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <MessageCard
                                    key={message._id}
                                    message={message}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            ))
                        ) : (
                            <p className="col-span-2 text-center text-gray-600 py-8">No messages to display.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;