import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TBH:Feedback from Real People',
  description: 'Anonymously share your thoughts, feelings, and opinions. Get real, unfiltered feedback from your friends or followers, NGL alternative, TBH feedback.',
  keywords: [
    'anonymous feedback', 'real opinions', 'anonymous sharing', 'thoughts', 'tbh app', 
    'ngl alternative', 'tbh feedback', 'anonymous messaging', 'real feedback', 'real feelings', 
    'express yourself', 'tbh', 'ngl feedback', 'ngl app'
  ],
  robots: 'index, follow',
  openGraph: {
    title: 'TBH: Feedback from Real People',
    description: 'Anonymously share your thoughts, feelings, and opinions.',
    url: 'https://tbhfeedback.live',
    siteName: 'TBH Feedback',
    type: 'website',
    images: [
      {
        url: 'https://tbhfeedback.live/favicon.png',
        width: 1200,
        height: 630,
        alt: 'TBH:Feedback from Real People',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TBH: Feedback from Real People',
    description: 'Anonymously share your thoughts, feelings, and opinions.',
    images: [
      {
        url: 'https://tbhfeedback.live/favicon.png',
        alt: 'TBH: Feedback from Real People',
      },
    ],
  },
  alternates: {
    canonical: 'https://tbhfeedback.live',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { [key: string]: any }; // Update this type as needed
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  // Generate the canonical URL based on the current pathname
  const canonicalUrl = `https://tbhfeedback.live${params.path ? `/${params.path}` : ''}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://tbhfeedback.live",
    "name": "TBH : Feedback",
    "description": "Anonymously share your thoughts, feelings, and opinions.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://tbhfeedback.live/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "TBH Feedback",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tbhfeedback.live/favicon.png"
      }
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
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Analytics />
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}



