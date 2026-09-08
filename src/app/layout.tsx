import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NetworkBar } from '@/components/NetworkBar';
import { ThemeScript } from '@/components/theme/ThemeScript';
import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';

const siteUrl = 'https://momandpopstore.com';
const defaultTitle = 'Mom & Pop Store | Local T&T Marketplace';
const defaultDescription =
  'Discover verified local businesses in Trinidad & Tobago. Browse storefronts, products, deals, and order directly via WhatsApp.';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | Mom & Pop Store',
  },
  description: defaultDescription,
  keywords: [
    'Mom and Pop Store',
    'Mom & Pop Store TT',
    'local shops Trinidad and Tobago',
    'buy local Trinidad',
    'online shopping Trinidad',
    'small businesses Trinidad and Tobago',
    'local marketplace Trinidad',
    'Tobago shops',
    'WhatsApp shopping Trinidad',
    'Trinidad and Tobago',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    type: 'website',
    siteName: 'Mom & Pop Store',
    locale: 'en_TT',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
  },
  category: 'shopping',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#d97706',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Mom & Pop Store',
                  url: siteUrl,
                  parentOrganization: {
                    '@type': 'Organization',
                    name: 'Sovereign Digital Solutions Limited',
                    url: 'https://sovdigitalgroup.com',
                  },
                  areaServed: { '@type': 'Country', name: 'Trinidad and Tobago' },
                },
                {
                  '@type': 'WebSite',
                  name: 'Mom & Pop Store',
                  url: siteUrl,
                  inLanguage: 'en-TT',
                  description: defaultDescription,
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: `${siteUrl}/stores?search={search_term_string}`,
                    'query-input': 'required name=search_term_string',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <NetworkBar currentSite="momandpopstore" />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
