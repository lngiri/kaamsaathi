'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'

export default function TaskerPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to browse page which shows all taskers
    router.replace('/browse')
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.bg,
      fontFamily: theme.fontFamily
    }}>
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: '#fff',
        borderRadius: theme.radiusLg,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadowLg,
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: theme.text,
          marginBottom: '16px'
        }}>
          Redirecting to Taskers...
        </h1>
        <p style={{
          fontSize: '16px',
          color: theme.muted,
          marginBottom: '24px'
        }}>
          Taking you to the browse page where you can find all available taskers.
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: `3px solid ${theme.border}`,
            borderTopColor: theme.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{
            fontSize: '14px',
            color: theme.muted
          }}>
            Please wait...
          </span>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  )
}