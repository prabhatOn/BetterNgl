import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TBH: Real Feedback from Real People',
  description: 'Anonymously share your thoughts, feelings, and opinions. Get real, unfiltered feedback from your friends or followers.',
  keywords: ['anonymous feedback', 'real opinions', 'anonymous sharing', 'thoughts', 'tbh app', 'ngl alternative', 'tbh feedback', 'anonymous messaging'],
  robots: 'index, follow',
  openGraph: {
    title: 'TBH: Real Feedback from Real People',
    description: 'Anonymously share your thoughts, feelings, and opinions. Get real, unfiltered feedback from your friends or followers.',
    url: 'https://tbhfeedback.live',
    siteName: 'TBH Feedback',
    type: 'website',
    images: [
      {
        url: 'https://tbhfeedback.live/favicon.png', // Make sure this is the correct path to your image
        width: 1200,
        height: 630,
        alt: 'TBH: Real Feedback from Real People',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TBH: Real Feedback from Real People',
    description: 'Anonymously share your thoughts, feelings, and opinions. Get real, unfiltered feedback from your friends or followers.',
    images: [
      {
        url: 'https://tbhfeedback.live/favicon.png',
        alt: 'TBH: Real Feedback from Real People',
      },
    ],
  },
  alternates: {
    canonical: 'https://tbhfeedback.live',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://tbhfeedback.live",
    "name": "TBH Feedback",
    "description": "Anonymously share your thoughts, feelings, and opinions. Get real, unfiltered feedback from your friends or followers.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tbhfeedback.live/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="qhgaXcxNf_Nb1XyEIC0my4_ydB7WfJ78yHE76erBx0s" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="author" content="TBH:Feedback" />
        <meta name="rating" content="General" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/public/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/public/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon.png" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
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
