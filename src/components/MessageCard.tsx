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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        const shareUrl = `${window.location.origin}/message/${message._id}`; // URL to share
        const shareText = message.content.length > 100 ? `${message.content.slice(0, 100)}...` : message.content;

        if (navigator.share) {
            navigator
                .share({
                    title: 'Check out this message!',
                    text: shareText,
                    url: shareUrl,
                })
                .catch((error) => console.error('Error sharing', error));
        } else {
            // Fallback to copy link if native sharing is not supported
            navigator.clipboard.writeText(shareUrl);
            toast({
                title: 'Link copied',
                description: 'The link has been copied to your clipboard.',
            });
        }
    };

    const handleSocialMediaShare = (platform: string) => {
        const shareUrl = `${window.location.origin}/message/${message._id}`;
        const shareText = message.content.length > 100 ? `${message.content.slice(0, 100)}...` : message.content;

        let socialUrl = '';
        switch (platform) {
            case 'twitter':
                socialUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                break;
            case 'facebook':
                socialUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                break;
            default:
                return;
        }
        window.open(socialUrl, '_blank');
    };

    const isLongMessage = message.content.length > 100;

    return (
        <Card className="bg-zinc-800/50 border border-zinc-700 rounded-lg transition-transform transform hover:scale-105 hover:bg-zinc-800/60 shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-start">
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
                        >
                            <Share2 className="w-5 h-5" />
                        </Button>

                        {/* Social Media Share */}
                        <Button
                            onClick={() => handleSocialMediaShare('twitter')}
                            className="p-2 text-white hover:text-blue-400"
                        >
                            Share on Twitter
                        </Button>
                        <Button
                            onClick={() => handleSocialMediaShare('facebook')}
                            className="p-2 text-white hover:text-blue-600"
                        >
                            Share on Facebook
                        </Button>

                        {/* Delete Button */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="p-2 text-red-500 hover:text-red-600">
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
                </div>

                {/* Date */}
                <div className="text-sm text-zinc-400 mt-2">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>

            <CardContent className="text-white font-body text-sm pt-4 pb-2 max-h-24 overflow-hidden">
                {isLongMessage && !isFullMessageShown && (
                    <div
                        className="cursor-pointer text-gray-300 hover:text-white"
                        onClick={() => setIsFullMessageShown(true)}
                    >
                        Show more
                    </div>
                )}

                {isLongMessage && isFullMessageShown && (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <div className="cursor-pointer text-gray-300 hover:text-white">
                                View full message
                            </div>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 text-white border border-zinc-700">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Full Message</DialogTitle>
                            </DialogHeader>
                            <div className="text-zinc-300">{message.content}</div>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>

            {/* Hidden canvas for image generation */}
            <canvas ref={canvasRef} width="400" height="200" className="hidden" />
        </Card>
    );
}
