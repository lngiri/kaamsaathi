'use client'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

export default function Navbar() {
  const router = useRouter()

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 5%', height: '68px', borderBottom: `1px solid ${theme.border}`,
      position: 'sticky', top: 0, background: theme.white, zIndex: 100,
      boxShadow: theme.shadow
    }}>
      {/* Logo */}
      <div
        onClick={() => router.push('/')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '38px', height: '38px', background: theme.primary,
          borderRadius: '10px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px'
        }}>क</div>
        <div>
          <div style={{ fontSize: '19px', fontWeight: 700, color: theme.text }}>KaamSathi</div>
          <div style={{ fontSize: '11px', color: theme.muted }}>काम साथी</div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
        <span
          onClick={() => router.push('/#how-it-works')}
          style={{ color: theme.muted, cursor: 'pointer' }}
        >
          How it Works
        </span>
        <span
          onClick={() => router.push('/browse')}
          style={{ color: theme.muted, cursor: 'pointer' }}
        >
          Browse / खोज्नुस्
        </span>
        <span
          onClick={() => router.push('/post-task')}
          style={{ color: theme.muted, cursor: 'pointer' }}
        >
          Post a Task
        </span>
        <span
          onClick={() => router.push('/become-tasker')}
          style={{ color: theme.muted, cursor: 'pointer' }}
        >
          Become a Tasker
        </span>

        {/* Login */}
        <button
          onClick={() => router.push('/auth?type=login')}
          style={{
            background: 'transparent', border: `1.5px solid ${theme.border}`,
            borderRadius: theme.radiusMd, padding: '8px 16px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: theme.text
          }}
        >
          Login / साइन इन
        </button>

        {/* Sign Up — splits into customer vs tasker */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => router.push('/auth?type=customer')}
            style={{
              background: theme.primary, color: '#fff', border: 'none',
              borderRadius: theme.radiusMd, padding: '9px 16px',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600
            }}
          >
            🔍 Hire a Tasker
          </button>
          <button
            onClick={() => router.push('/auth?type=tasker')}
            style={{
              background: theme.secondary, color: '#fff', border: 'none',
              borderRadius: theme.radiusMd, padding: '9px 16px',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600
            }}
          >
            💼 Be a Tasker
          </button>
        </div>
      </div>
    </nav>
  )
}