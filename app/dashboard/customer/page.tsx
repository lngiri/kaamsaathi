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

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState(0)
  const [referralCount, setReferralCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        await ensureProfileRow(user.id)
        const profile = await getProfileSnapshot(user.id)
        setPoints(profile.points)
        setReferralCount(await countReferredUsers(user.id))
      } else {
        router.replace('/auth?type=customer')
        return
      }
      setLoading(false)
    }
    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: theme.fontFamily }}>
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
          Loading dashboard...
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main style={{ minHeight: '100vh', background: '#f9f9f9', fontFamily: theme.fontFamily }}>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px', color: theme.text }}>My Dashboard</h1>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: theme.shadowLg, marginBottom: '18px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '15px', color: theme.primary }}>Your Points: {points} pts</h2>
          <p style={{ fontSize: '14px', color: theme.muted }}>Earn 10 points for every Rs 100 spent. Redeem 500 points for Rs 50 off your next booking!</p>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: theme.shadowLg }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '15px', color: theme.secondary }}>Referral Progress</h2>
          <p style={{ fontSize: '14px', color: theme.muted, marginBottom: '16px' }}>
            Successful referrals: {referralCount}
          </p>
          <button onClick={() => router.push('/refer')} style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}>
            Open Refer & Earn
          </button>
        </div>
      </div>
    </main>
  )
}
