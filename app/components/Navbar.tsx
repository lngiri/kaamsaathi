'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'
import { supabase } from '@/lib/supabase'
import { getTaskerProfile } from '@/lib/appAuth'

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isTasker, setIsTasker] = useState(false)

  useEffect(() => {
    let mounted = true

    async function syncAuthState(nextUser: User | null) {
      if (!mounted) return

      setUser(nextUser)

      if (!nextUser) {
        setIsTasker(false)
        return
      }

      const taskerProfile = await getTaskerProfile(nextUser.id)
      if (mounted) {
        setIsTasker(Boolean(taskerProfile))
      }
    }

    supabase.auth.getUser().then(({ data }) => {
      void syncAuthState(data.user)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        void syncAuthState(session?.user ?? null)
      }
    )

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 5%', height: '68px', borderBottom: `1px solid ${theme.border}`,
      position: 'sticky', top: 0, background: theme.white, zIndex: 100,
      boxShadow: theme.shadow
    }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px' }}>
        <span onClick={() => router.push('/#how-it-works')} style={{ color: theme.muted, cursor: 'pointer' }}>
          How it Works / कसरी काम गर्छ
        </span>
        <span onClick={() => router.push('/browse')} style={{ color: theme.muted, cursor: 'pointer' }}>
          Browse / खोज्नुस्
        </span>
        <span onClick={() => router.push('/post-task')} style={{ color: theme.muted, cursor: 'pointer' }}>
          Post a Task / काम पोस्ट गर्नुस्
        </span>
        <span onClick={() => router.push('/become-tasker')} style={{ color: theme.muted, cursor: 'pointer' }}>
          Become a Tasker / साथी बन्नुस्
        </span>
        <span onClick={() => router.push('/refer')} style={{ color: theme.primary, cursor: 'pointer', fontWeight: 700 }}>
          Refer & Earn / सिफारिस गर्नुस्
        </span>

        {user ? (
          <>
            <span
              onClick={() => router.push(isTasker ? '/dashboard/tasker' : '/dashboard/customer')}
              style={{ color: theme.muted, cursor: 'pointer' }}
            >
              {isTasker ? 'Tasker Dashboard / साथी ड्यासबोर्ड' : 'My Dashboard / मेरो ड्यासबोर्ड'}
            </span>
            <button
              onClick={handleSignOut}
              style={{
                background: 'transparent', border: `1.5px solid ${theme.border}`,
                borderRadius: theme.radiusMd, padding: '8px 16px',
                cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: theme.text
              }}
            >
              Sign Out / साइन आउट
            </button>
          </>
        ) : (
          <>
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
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => router.push('/auth?type=customer')}
                style={{
                  background: theme.primary, color: '#fff', border: 'none',
                  borderRadius: theme.radiusMd, padding: '9px 16px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}
              >
                Hire a Tasker / साथी भाडामा लिनुस्
              </button>
              <button
                onClick={() => router.push('/auth?type=tasker')}
                style={{
                  background: theme.secondary, color: '#fff', border: 'none',
                  borderRadius: theme.radiusMd, padding: '9px 16px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}
              >
                Be a Tasker / साथी बन्नुस्
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
