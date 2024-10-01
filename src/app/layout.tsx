import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TBH: Real feedback from real people',
  description: 'Anonymously share your thoughts and feelings with others.',
  keywords: ['feedback', 'anonymous', 'opinions', 'thoughts', 'sharing','ngl','tbh','messages'], // Add relevant keywords
  robots: 'index, follow', // Allow search engines to index the page
  openGraph: {
    title: 'TBH: Real feedback from real people',
    description: 'Anonymously share your thoughts and feelings with others.',
    url: 'https://tbh.techxavvy.in', // Replace with your actual URL
    siteName: 'TBH',
    type: 'website',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
