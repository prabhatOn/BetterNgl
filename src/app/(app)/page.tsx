'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
    return (
        <>
            {/* Main content */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-white text-black">
                <section className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold">
                        True Feedback: Anonymous, Secure, and Fun!
                    </h1>
                    <p className="mt-3 md:mt-4 text-base md:text-lg">
                        Share and receive honest feedback with enhanced privacy features.
                    </p>
                </section>

                {/* Carousel for Messages */}
                <Carousel
                    plugins={[Autoplay({ delay: 3000 })]} // Increased delay for better readability
                    className="w-full max-w-lg md:max-w-xl"
                >
                    <CarouselContent>
                        {messages.map((message, index) => (
                            <CarouselItem key={index} className="p-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{message.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                                        <Mail className="flex-shrink-0" />
                                        <div>
                                            <p>{message.content}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {message.received}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </main>

            {/* Footer */}
            <footer className="text-center p-4 md:p-6 bg-transparent text-black">
                <p>
                    © 2024 True Feedback. Revolutionizing how you share thoughts and feelings anonymously.
                </p>
                {/* <p className="text-sm mt-2">
                    <Link href="/privacy">Privacy Policy</Link> |{' '}
                    <Link href="/terms">Terms of Service</Link>
                </p> */}
            </footer>
        </>
    );
}