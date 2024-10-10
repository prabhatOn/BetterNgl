'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
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

    const handleShare = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Set canvas dimensions
        canvas.width = 1200;
        canvas.height = 630;

        // Create gradient background
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#1f1f1f');
        gradient.addColorStop(1, '#6a0dad');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Load and draw logo
        const logo = await loadImage('/favico.png');
        const logoSize = 80;
        const logoX = canvas.width / 2 - logoSize / 2;
        const logoY = 40;
        context.drawImage(logo, logoX, logoY, logoSize, logoSize);

        // Set text styles
        context.font = '36px "Helvetica Neue", sans-serif';
        context.fillStyle = '#fff';
        context.textAlign = 'center';

        // Wrap and draw message content
        const maxWidth = canvas.width - 100;
        const lines = wrapText(context, message.content, maxWidth);
        const lineHeight = 48;
        const textY = canvas.height / 2 - (lines.length * lineHeight) / 2;

        lines.forEach((line, index) => {
            context.fillText(line, canvas.width / 2, textY + index * lineHeight);
        });

        // Draw branding
        context.font = '24px "Helvetica Neue", sans-serif';
        context.fillText('tbhfeedback.live', canvas.width - 60, canvas.height - 30);

        // Create a shareable image
        try {
            const blob = await new Promise<Blob>((resolve) => canvas.toBlob((blob) => resolve(blob!)));
            const file = new File([blob], 'message.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Check out this message!',
                });
            } else {
                // Fallback for browsers that don't support sharing files
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'message.png';
                link.click();
            }
        } catch (error) {
            console.error('Error sharing', error);
            toast({
                title: 'Sharing failed',
                description: 'Unable to share the message. You can try saving the image instead.',
                variant: 'destructive',
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

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
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
                        className="p-2 text-white hover:text-gray-300"
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
            <CardContent className="mt-1 text-sm text-gray-400">
                {dayjs(message.createdAt).format('MMMM D, YYYY h:mm A')}
            </CardContent>

            {/* Show full message */}
            {isLongMessage && (
                <Button
                    variant="link"
                    className="text-indigo-500 hover:underline mt-2 text-sm"
                    onClick={() => setIsFullMessageShown(!isFullMessageShown)}
                >
                    {isFullMessageShown ? 'Show Less' : 'Read More'}
                </Button>
            )}

            {/* Hidden canvas for rendering shareable image */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </Card>
    );
}