import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TBH: Real feedback from real people',
  description: 'Anonymously share your thoughts and feelings with others.',
  keywords: ['feedback', 'anonymous', 'opinions', 'thoughts', 'sharing', 'ngl', 'tbh', 'messages'],
  robots: 'index, follow',
  openGraph: {
    title: 'TBH: Real feedback from real people',
    description: 'Anonymously share your thoughts and feelings with others.',
    url: 'https://tbhfeedback.live', 
    siteName: 'TBH',
    type: 'website',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1e293b" />
      </head>
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
