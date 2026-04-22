'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { theme } from '@/lib/theme'
import { ensureUserRecords } from '@/lib/appAuth'
import {
  getSupabaseErrorMessage,
  isSchemaDriftError,
  warnSchemaDrift,
} from '@/lib/supabaseSafe'

const SKILL_OPTIONS = [
  'Plumbing',
  'Cleaning',
  'Electrical',
  'Tutoring',
  'Moving',
  'Cooking',
  'Tech Help',
  'Gardening',
  'Caretaking',
  'Painting',
  'Driver',
  'Pet Care',
]

export default function BecomeTaskerPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const [hourlyRate, setHourlyRate] = useState('800')
  const [skills, setSkills] = useState<string[]>(['Cleaning'])
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth?type=tasker')
        return
      }

      setUser(user)
      setBio(
        user.user_metadata?.full_name
          ? `${user.user_metadata.full_name} is ready to help with quality local services.`
          : ''
      )

      const { data: existingTasker, error } = await supabase
        .from('taskers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (error) {
        if (isSchemaDriftError(error)) {
          warnSchemaDrift('taskers existing profile lookup fallback', error)
        } else {
          console.warn(
            `[Supabase contract] existing tasker lookup failed: ${getSupabaseErrorMessage(
              error
            )}`
          )
        }
      }

      if (existingTasker) {
        router.replace('/dashboard/tasker')
        return
      }

      setLoading(false)
    }

    void loadUser()
  }, [router])

  const toggleSkill = (skill: string) => {
    setSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    )
  }

  const handleSubmit = async () => {
    if (!user) return
    if (!bio.trim()) return setError('Please add a short bio.')
    if (skills.length === 0) return setError('Please select at least one skill.')

    setError('')
    setSaving(true)
    await ensureUserRecords(user, 'tasker')

    const taskerVariants = [
      {
        user_id: user.id,
        bio,
        city,
        skills,
        hourly_rate: Number(hourlyRate) || 0,
        rating: 0,
        total_tasks: 0,
        is_online: false,
        status: 'active',
        radius_km: 10,
      },
      {
        user_id: user.id,
        bio,
        city,
        skills,
        hourly_rate: Number(hourlyRate) || 0,
        status: 'active',
      },
      {
        user_id: user.id,
        bio,
        city,
        hourly_rate: Number(hourlyRate) || 0,
      },
    ]

    let insertError: { message?: string } | null = null

    for (const variant of taskerVariants) {
      const { error } = await supabase.from('taskers').insert(variant)
      if (!error) {
        insertError = null
        break
      }

      insertError = error

      if (!isSchemaDriftError(error)) {
        break
      }

      warnSchemaDrift('taskers insert fallback', error)
    }

    if (insertError) {
      setError(insertError.message || 'Unable to create your tasker profile right now.')
      setSaving(false)
      return
    }

    await supabase
      .from('users')
      .update({ role: 'tasker' })
      .eq('id', user.id)

    setSuccessMsg('Tasker profile created successfully. Redirecting...')
    setTimeout(() => router.push('/dashboard/tasker'), 800)
  }

  if (loading || !user) {
    return (
      <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
          Loading tasker setup...
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: '18px', padding: '28px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '10px', color: theme.text }}>Become a Tasker</h1>
          <p style={{ color: theme.muted, marginBottom: '24px' }}>Set up your basic profile so customers can discover and book you.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.muted, marginBottom: '6px' }}>City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.muted, marginBottom: '6px' }}>Hourly Rate</label>
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} style={{ width: '100%', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.muted, marginBottom: '6px' }}>Short Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: '100%', minHeight: '110px', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px', resize: 'vertical' }} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: theme.muted, marginBottom: '8px' }}>Skills</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SKILL_OPTIONS.map((skill) => {
                const selected = skills.includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    style={{
                      background: selected ? theme.primaryLight : '#fff',
                      color: selected ? theme.primary : theme.text,
                      border: `1px solid ${selected ? theme.primary : theme.border}`,
                      borderRadius: '999px',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>

          {error && <p style={{ color: theme.primary, marginBottom: '14px' }}>{error}</p>}
          {successMsg && <p style={{ color: theme.green, marginBottom: '14px' }}>{successMsg}</p>}

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={handleSubmit} disabled={saving} style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 18px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Create Tasker Profile'}
            </button>
            <button onClick={() => router.push('/dashboard/tasker')} style={{ background: '#fff', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '12px 18px', fontWeight: 600, cursor: 'pointer' }}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
