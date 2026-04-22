'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { theme } from '@/lib/theme'
import {
  countReferredUsers,
  ensureProfileRow,
  getProfileSnapshot,
} from '@/lib/appAuth'

export default function ReferPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [copyMsg, setCopyMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReferralData() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth?type=customer')
        return
      }

      setUser(user)
      await ensureProfileRow(user.id)

      const [profile, count] = await Promise.all([
        getProfileSnapshot(user.id),
        countReferredUsers(user.id),
      ])

      setPoints(profile.points)
      setReferralCount(count)
      setLoading(false)
    }

    void loadReferralData()
  }, [router])

  if (loading || !user) {
    return (
      <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
          Loading referral program...
        </div>
      </main>
    )
  }

  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth?type=customer&ref=${user.id}`
      : `/auth?type=customer&ref=${user.id}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink)
    setCopyMsg('Referral link copied.')
    window.setTimeout(() => setCopyMsg(''), 2000)
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: 'Join KaamSathi',
        text: 'Use my KaamSathi referral link and get your first booking discount.',
        url: referralLink,
      })
      return
    }

    await handleCopy()
  }

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, color: '#fff', borderRadius: '18px', padding: '32px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '10px' }}>Refer & Earn</h1>
          <p style={{ fontSize: '15px', opacity: 0.85, maxWidth: '640px' }}>
            Share your link with friends. When a referred customer makes their first booking, they get Rs 100 off and you earn referral credit.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '20px' }}>
          {[
            { label: 'Current Points', value: `${points} pts` },
            { label: 'Successful Referrals', value: `${referralCount}` },
            { label: 'Referral Reward', value: 'Rs 100 / first booking' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '22px' }}>
              <div style={{ fontSize: '12px', color: theme.muted, textTransform: 'uppercase', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: theme.text }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: '16px', padding: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: theme.muted, marginBottom: '8px', textTransform: 'uppercase' }}>Your Referral Link</div>
          <div style={{ background: theme.bg, borderRadius: '12px', padding: '14px', fontSize: '14px', wordBreak: 'break-all', marginBottom: '14px' }}>
            {referralLink}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleCopy} style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
              Copy Link
            </button>
            <button onClick={handleShare} style={{ background: theme.secondary, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
              Share Link
            </button>
            <button onClick={() => router.push('/dashboard/customer')} style={{ background: '#fff', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px 18px', fontWeight: 600, cursor: 'pointer' }}>
              Back to Dashboard
            </button>
          </div>
          {copyMsg && <p style={{ color: theme.green, marginTop: '12px', fontSize: '13px' }}>{copyMsg}</p>}
        </div>
      </div>
    </main>
  )
}
