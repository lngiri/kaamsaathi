import type { Metadata, Viewport } from 'next'
import './globals.css'
import InstallPrompt from '@/app/components/InstallPrompt'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export const metadata: Metadata = {
  title: 'KaamSathi | काम साथी — Nepal\'s #1 Local Services Platform',
  description: 'Find trusted local taskers for home repairs, cleaning, tutoring and more across Nepal. नेपालको भरपर्दो सेवा प्लेटफर्म।',
  keywords: 'KaamSathi, काम साथी, Nepal services, hire tasker Nepal, home repair Kathmandu, cleaning service Nepal, plumber Kathmandu',
  authors: [{ name: 'KaamSathi Team' }],
  openGraph: {
    title: 'KaamSathi | काम साथी',
    description: 'Nepal\'s trusted platform for local home services',
    type: 'website',
    locale: 'ne_NP',
    siteName: 'KaamSathi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KaamSathi | काम साथी',
    description: 'Nepal\'s trusted platform for local home services',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ne">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <meta name="theme-color" content="#DC143C" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', sans-serif", paddingBottom: '80px' }}>
        <Navbar />
        <InstallPrompt />
        {children}
        <Footer />

        {/* Global Sticky Trust Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          borderTop: '1px solid #eee',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          zIndex: 9999,
          fontSize: '11px',
          fontWeight: 700,
          color: '#444',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          flexWrap: 'wrap',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px' }}>🛡️</span> Verified IDs
          </div>
          <div style={{ color: '#ccc' }}>•</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px' }}>🔒</span> eSewa/Khalti Secure
          </div>
          <div style={{ color: '#ccc' }}>•</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '14px' }}>✅</span> 100% Task Guarantee
          </div>
        </div>
      </body>
    </html>
  )
}