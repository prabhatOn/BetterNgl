'use client';

import React, { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Share2 } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isFullMessageShown, setIsFullMessageShown] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast({
                title: response.data.message,
            });
            onMessageDelete(message._id);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };

    const handleShare = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = '#333';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.font = '16px sans-serif';
            context.fillStyle = '#fff';
            context.fillText('Message:', 10, 20);

            const lines = wrapText(context, message.content, 380);
            lines.forEach((line, index) => {
                context.fillText(line, 10, 40 + index * 20);
            });

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'message.png', { type: 'image/png' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        navigator
                            .share({
                                files: [file],
                                title: 'Check out this message!',
                            })
                            .catch((error) => console.error('Error sharing', error));
                    } else {
                        toast({
                            title: 'Sharing not supported',
                            description: 'Sharing is not supported on this device.',
                        });
                    }
                }
            });
        }
    };

    const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    };

    const isLongMessage = message.content.length > 100;

    return (
        <Card className="bg-zinc-800/50 border border-zinc-700 rounded-lg transition-transform transform hover:scale-105 hover:bg-zinc-800/60 shadow-lg p-4 w-full sm:max-w-md">
            <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-lg text-white font-semibold font-display">
                    {isFullMessageShown || !isLongMessage
                        ? message.content
                        : `${message.content.slice(0, 100)}...`}
                </CardTitle>
                <div className="flex space-x-2">
                    {/* Share Button */}
                    <Button
                        variant="secondary"
                        className="p-2 text-black hover:text-gray-300"
                        onClick={handleShare}
                        aria-label="Share message"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>

                    {/* Delete Button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="p-2 text-white hover:text-red-600"
                                aria-label="Delete message"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-900 text-white border border-zinc-700">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-bold text-red-500">
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-zinc-300">
                                    This action cannot be undone. This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel asChild>
                                    <Button variant="secondary" className="bg-zinc-700 hover:bg-zinc-600">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm} asChild>
                                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>

            {/* Date */}
            <div className="text-sm text-zinc-400 mt-2">
                {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </div>

            <CardContent
                className={`text-white font-body text-sm pt-4 pb-2 ${
                    isFullMessageShown ? '' : isLongMessage ? 'max-h-40 overflow-hidden' : ''
                }`}
            >
                {isLongMessage && (
                    <div
                        className="cursor-pointer text-gray-300 hover:text-white mt-2"
                        onClick={() => setIsFullMessageShown(!isFullMessageShown)}
                    >
                        {isFullMessageShown ? 'Show less' : 'Show more'}
                    </div>
                )}
            </CardContent>

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} width="400" height="200" className="hidden" />
        </Card>
    );
}
