import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import '../styles/globals.css'
import Navbar from '@/components/Navbar' // Yukarıda güncellediğimiz dosya buradan gelecek
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Akorify - Şarkı Sözleri ve Gitar Akorları',
    template: '%s | Akorify',
  },
  applicationName: 'Akorify',
  description:
    "Türkiye'nin en kapsamlı şarkı sözleri ve gitar akorları platformu. Binlerce şarkının sözleri ve akorlarını keşfedin.",
  keywords: [
    'şarkı sözleri',
    'gitar akorları',
    'müzik',
    'akor',
    'şarkı',
    'lyrics',
    'chords',
    'guitar',
  ],
  authors: [{ name: 'Akorify' }],
  creator: 'Akorify',
  publisher: 'Akorify',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'Akorify - Şarkı Sözleri ve Gitar Akorları',
    description:
      "Türkiye'nin en kapsamlı şarkı sözleri ve gitar akorları platformu. Binlerce şarkının sözleri ve akorlarını keşfedin.",
    siteName: 'Akorify',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akorify - Şarkı Sözleri ve Gitar Akorları',
    description:
      "Türkiye'nin en kapsamlı şarkı sözleri ve gitar akorları platformu. Binlerce şarkının sözleri ve akorlarını keşfedin.",
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
    // google: 'your-verification-code',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {/* Navbar artık Auth özellikli */}
        <Navbar />

        <main className="flex-1">{children}</main>

        <Footer />

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  )
}
