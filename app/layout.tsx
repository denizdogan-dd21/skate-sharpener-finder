import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import AuthProvider from './providers'
import IntlProvider from './IntlProvider'
import { LayoutClient } from './layout-client'

const inter = Inter({ subsets: ['latin'] })

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://skatesharpener.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Skate Sharpener Connection - Find Professional Skate Sharpeners Near You',
    template: '%s | Skate Sharpener Connection'
  },
  description: 'Connect with trusted ice hockey skate sharpening professionals. Browse profiles, view availability, ratings, and book appointments with local sharpeners near you.',
  keywords: [
    'skate sharpening',
    'hockey skate sharpening',
    'ice skate sharpening',
    'skate sharpener near me',
    'professional skate sharpening',
    'book skate sharpening',
    'hockey equipment',
    'skate maintenance',
    'local skate sharpener',
    'ice hockey services'
  ],
  authors: [{ name: 'Skate Sharpener Connection' }],
  creator: 'Skate Sharpener Connection',
  publisher: 'Skate Sharpener Connection',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'de_DE',
    url: baseUrl,
    title: 'Skate Sharpener Connection - Find Professional Skate Sharpeners',
    description: 'Connect with trusted ice hockey skate sharpening professionals. Browse profiles, view availability, and book appointments.',
    siteName: 'Skate Sharpener Connection',
    images: [
      {
        url: `${baseUrl}/hockey-skates.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Ice Hockey Skates - Skate Sharpener Connection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skate Sharpener Connection - Find Professional Skate Sharpeners',
    description: 'Connect with trusted ice hockey skate sharpening professionals. Browse profiles, view availability, and book appointments.',
    images: [`${baseUrl}/hockey-skates.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification=LdUsYo--JNzPAheFfeRV1LdJNRw5pib-Kr7AJP9uJkg',
  },
  alternates: {
    canonical: baseUrl,
  },
  category: 'Sports Services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <IntlProvider>
            <LayoutClient>{children}</LayoutClient>
          </IntlProvider>
        </AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
