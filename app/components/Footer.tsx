'use client'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

export default function Footer() {
  const router = useRouter()
  const year = new Date().getFullYear()

  const links = {
    Services: [
      { label: 'Plumbing / प्लम्बिङ', path: '/browse?search=Plumbing' },
      { label: 'Cleaning / सफाई', path: '/browse?search=Cleaning' },
      { label: 'Electrical / विद्युत', path: '/browse?search=Electrical' },
      { label: 'Moving / सार्ने', path: '/browse?search=Moving' },
      { label: 'All Services →', path: '/browse' },
    ],
    Company: [
      { label: 'About Us', path: '/#about' },
      { label: 'How It Works', path: '/#how-it-works' },
      { label: 'Careers / रोजगार', path: '/careers' },
      { label: 'Blog', path: '/blog' },
      { label: 'Press', path: '/press' },
    ],
    Support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Safety / सुरक्षा', path: '/safety' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Contact Us', path: '/contact' },
    ],
  }

  return (
    <footer style={{ background: '#1a1a1a', color: '#ccc', padding: '48px 5% 28px', fontFamily: theme.fontFamily }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3,1fr)', gap: '32px', marginBottom: '36px', maxWidth: '1200px', margin: '0 auto 36px' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{ width: '34px', height: '34px', background: theme.primary, borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px' }}>क</div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>KaamSathi</div>
              <div style={{ fontSize: '11px', color: '#888' }}>काम साथी</div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.7, marginBottom: '12px' }}>
            Nepal&apos;s trusted platform connecting people with skilled local taskers. Made in Nepal 🇳🇵 by Nepali, for Nepali.
          </p>
          <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.8 }}>
            📧 hello@kaamsathi.com.np<br />
            📞 +977-01-XXXXXXX<br />
            🏢 Kathmandu, Nepal
          </p>
          {/* Social */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            {['Facebook', 'Instagram', 'Twitter', 'TikTok'].map(s => (
              <div key={s} title={s} style={{ width: '32px', height: '32px', background: '#333', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' }}>
                {s === 'Facebook' ? 'f' : s === 'Instagram' ? '📸' : s === 'Twitter' ? '𝕏' : '♪'}
              </div>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>
              {title}
            </h5>
            {items.map(link => (
              <button
                key={link.label}
                onClick={() => router.push(link.path)}
                style={{ display: 'block', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '9px', textAlign: 'left', padding: 0, transition: 'color .15s', fontFamily: theme.fontFamily }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#888')}
              >
                {link.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#666' }}>
        <span>© {year} KaamSathi Pvt. Ltd. — Made with <span style={{ color: theme.primary }}>❤</span> in Nepal 🇳🇵</span>
        <span>काम साथी — नेपालको आफ्नो प्लेटफर्म</span>
      </div>
    </footer>
  )
}