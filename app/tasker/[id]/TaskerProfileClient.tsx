'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { theme } from '@/lib/theme'
import { formatPrice, formatDate } from '@/lib/helpers'
import BookingModal from '@/app/components/BookingModal'
import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  asStringArray,
  getSupabaseErrorMessage,
  isSchemaDriftError,
  warnSchemaDrift,
} from '@/lib/supabaseSafe'

type Tasker = {
  id: string
  bio: string
  skills: string[]
  hourly_rate: number
  city: string
  rating: number
  total_tasks: number
  is_online: boolean
  status: string
  radius_km: number
  users: {
    full_name: string
    avatar_url?: string
    phone?: string
    created_at: string
  }
}

type Review = {
  id: string
  rating: number
  comment: string
  created_at: string
  users: { full_name: string }
}

type Props = {
  id: string
}

function normalizeTasker(row: unknown): Tasker | null {
  const record = asRecord(row)
  if (!record) return null

  const userRecord = asRecord(record.users)

  return {
    id: asString(record.id),
    bio: asString(record.bio),
    skills: asStringArray(record.skills),
    hourly_rate: asNumber(record.hourly_rate, 0),
    city: asString(record.city, 'Kathmandu'),
    rating: asNumber(record.rating, 0),
    total_tasks: asNumber(record.total_tasks, 0),
    is_online: asBoolean(record.is_online, false),
    status: asString(record.status, 'active'),
    radius_km: asNumber(record.radius_km, 0),
    users: {
      full_name: asString(userRecord?.full_name, 'Tasker'),
      avatar_url: asString(userRecord?.avatar_url),
      phone: asString(userRecord?.phone),
      created_at: asString(userRecord?.created_at),
    },
  }
}

function normalizeReview(row: unknown): Review | null {
  const record = asRecord(row)
  if (!record) return null

  const userRecord = asRecord(record.users)

  return {
    id: asString(record.id),
    rating: asNumber(record.rating, 0),
    comment: asString(record.comment),
    created_at: asString(record.created_at),
    users: {
      full_name: asString(userRecord?.full_name, 'Customer'),
    },
  }
}

export default function TaskerProfileClient({ id }: Props) {
  const router = useRouter()
  const [tasker, setTasker] = useState<Tasker | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about')

  useEffect(() => {
    async function load() {
      let { data: taskerData, error: taskerError } = await supabase
        .from('taskers')
        .select('*, users(full_name, avatar_url, phone, created_at)')
        .eq('id', id)
        .maybeSingle()

      if (taskerError && isSchemaDriftError(taskerError)) {
        warnSchemaDrift('tasker profile relation fallback', taskerError)
        const fallbackResponse = await supabase
          .from('taskers')
          .select('*')
          .eq('id', id)
          .maybeSingle()
        taskerData = fallbackResponse.data
        taskerError = fallbackResponse.error
      }

      if (taskerError && !isSchemaDriftError(taskerError)) {
        console.warn(
          `[Supabase contract] tasker profile load failed: ${getSupabaseErrorMessage(
            taskerError
          )}`
        )
      }

      setTasker(normalizeTasker(taskerData))

      let { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .select('*, users(full_name)')
        .eq('tasker_id', id)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10)

      if (reviewError && isSchemaDriftError(reviewError)) {
        warnSchemaDrift('reviews relation fallback', reviewError)
        const fallbackResponse = await supabase
          .from('reviews')
          .select('*')
          .eq('tasker_id', id)
          .order('created_at', { ascending: false })
          .limit(10)
        reviewData = fallbackResponse.data
        reviewError = fallbackResponse.error
      }

      if (reviewError && !isSchemaDriftError(reviewError)) {
        console.warn(
          `[Supabase contract] reviews load failed: ${getSupabaseErrorMessage(
            reviewError
          )}`
        )
      }

      setReviews(
        (reviewData || [])
          .map((row) => normalizeReview(row))
          .filter(Boolean) as Review[]
      )
      setLoading(false)
    }
    if (id) load()
  }, [id])

  if (loading) return (
    <main style={{ fontFamily: theme.fontFamily }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: theme.muted }}>
        Loading tasker profile...
      </div>
    </main>
  )

  if (!tasker) return (
    <main style={{ fontFamily: theme.fontFamily }}>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>ðŸ˜•</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Tasker not found</h2>
        <button onClick={() => router.push('/browse')} style={{ marginTop: '16px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, cursor: 'pointer' }}>Browse Taskers</button>
      </div>
    </main>
  )

  const name = tasker.users?.full_name || 'Tasker'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      {showBooking && (
        <BookingModal
          tasker={tasker}
          onClose={() => setShowBooking(false)}
        />
      )}

      <div style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, padding: '40px 5%', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            {tasker.users?.avatar_url ? (
              <div
                role="img"
                aria-label={name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  backgroundImage: `url("${tasker.users.avatar_url}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '3px solid rgba(255,255,255,0.4)',
                }}
              />
            ) : (
              <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700, border: '3px solid rgba(255,255,255,0.4)' }}>
                {initials}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', width: '18px', height: '18px', borderRadius: '50%', background: tasker.is_online ? '#16a34a' : '#ccc', border: '3px solid #fff' }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{name}</h1>
              {tasker.is_online && <span style={{ background: '#16a34a', color: '#fff', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>â— ONLINE</span>}
            </div>
            <p style={{ fontSize: '14px', opacity: 0.85, marginBottom: '10px' }}>
              ðŸ“ {tasker.city} Â· â­ {tasker.rating} rating Â· {tasker.total_tasks} tasks completed Â· Member since {formatDate(tasker.users?.created_at)}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {(tasker.skills || []).map(s => (
                <span key={s} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px', padding: '4px 12px', borderRadius: '12px', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: 700 }}>{formatPrice(tasker.hourly_rate)}/hr</span>
              <button
                onClick={() => setShowBooking(true)}
                style={{ background: '#fff', color: theme.primary, border: 'none', borderRadius: '10px', padding: '11px 24px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
              >
                ðŸ“… Book Now â€” à¤¬à¥à¤• à¤—à¤°à¥à¤¨à¥à¤¸à¥
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '22px', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', border: `1px solid ${theme.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '20px', background: '#fff' }}>
              {(['about', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '11px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: activeTab === tab ? theme.primary : '#fff', color: activeTab === tab ? '#fff' : theme.muted, fontFamily: theme.fontFamily }}
                >
                  {tab === 'about' ? 'About / à¤¬à¤¾à¤°à¥‡' : `Reviews (${reviews.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'about' && (
              <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '22px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>About / à¤†à¤«à¥à¤¨à¥‹ à¤¬à¤¾à¤°à¥‡</h3>
                <p style={{ fontSize: '14px', color: theme.muted, lineHeight: 1.7, marginBottom: '20px' }}>
                  {tasker.bio || 'This tasker has not added a bio yet.'}
                </p>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Skills / à¤¸à¥€à¤ªà¤¹à¤°à¥‚</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {(tasker.skills || []).map(s => (
                    <span key={s} style={{ background: theme.primaryLight, color: theme.primary, fontSize: '13px', padding: '5px 14px', borderRadius: '12px', fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    ['City', tasker.city],
                    ['Service Radius', `${tasker.radius_km} km`],
                    ['Rating', `â­ ${tasker.rating}`],
                    ['Tasks Done', `${tasker.total_tasks} tasks`],
                    ['Rate', `${formatPrice(tasker.hourly_rate)}/hr`],
                    ['Status', tasker.is_online ? 'â— Available Now' : 'â—‹ Offline'],
                  ].map(([l, v]) => (
                    <div key={l} style={{ background: theme.bg, borderRadius: '9px', padding: '11px 14px' }}>
                      <div style={{ fontSize: '10px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>{l}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '32px', textAlign: 'center', color: theme.muted }}>
                    No reviews yet. Be the first to book and review!
                  </div>
                ) : reviews.map(r => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '14px' }}>{r.users?.full_name || 'Customer'}</span>
                      <span style={{ fontSize: '12px', color: theme.muted }}>{formatDate(r.created_at)}</span>
                    </div>
                    <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '6px' }}>{'â˜…'.repeat(r.rating)}{'â˜†'.repeat(5 - r.rating)}</div>
                    <p style={{ fontSize: '13px', color: theme.muted, lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '20px', marginBottom: '14px' }}>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>{formatPrice(tasker.hourly_rate)}/hr</div>
              <p style={{ fontSize: '12px', color: theme.muted, marginBottom: '16px' }}>Starting rate. Final price confirmed before booking.</p>
              <button
                onClick={() => setShowBooking(true)}
                style={{ width: '100%', padding: '13px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', marginBottom: '10px' }}
              >
                ðŸ“… Book Now
              </button>
              <button
                onClick={() => router.push('/browse')}
                style={{ width: '100%', padding: '11px', background: '#fff', color: theme.text, border: `1.5px solid ${theme.border}`, borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                â† Back to Browse
              </button>
            </div>

            <div style={{ background: theme.amberBg, borderRadius: '10px', padding: '14px', fontSize: '12px', color: '#92400e' }}>
              <strong>ðŸ”’ Safe & Secure</strong><br />
              Payment held until task is completed. 100% refund if tasker doesn&apos;t show.
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
