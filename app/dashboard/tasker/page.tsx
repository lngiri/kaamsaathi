'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { theme } from '@/lib/theme'
import { formatPrice, formatDate, statusColor, calcPayout } from '@/lib/helpers'
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

type Booking = {
  id: string
  ref_code: string
  status: string
  total_amount: number
  scheduled_at: string
  task_description: string
  address: string
  payment_method: string
  services: { name_en: string; icon: string } | null
  users: { full_name: string; phone?: string } | null
}

type TaskerProfile = {
  id: string
  bio: string
  skills: string[]
  hourly_rate: number
  city: string
  rating: number
  total_tasks: number
  is_online: boolean
  status: string
}

function normalizeTaskerProfile(row: unknown): TaskerProfile | null {
  const record = asRecord(row)
  if (!record) return null

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
  }
}

function normalizeBooking(row: unknown): Booking | null {
  const record = asRecord(row)
  if (!record) return null

  const serviceRecord = asRecord(record.services)
  const userRecord = asRecord(record.users)

  return {
    id: asString(record.id),
    ref_code: asString(record.ref_code),
    status: asString(record.status, 'pending'),
    total_amount: asNumber(record.total_amount, 0),
    scheduled_at: asString(record.scheduled_at),
    task_description: asString(record.task_description),
    address: asString(record.address),
    payment_method: asString(record.payment_method),
    services: serviceRecord
      ? {
          name_en: asString(serviceRecord.name_en, 'Service'),
          icon: asString(serviceRecord.icon),
        }
      : null,
    users: userRecord
      ? {
          full_name: asString(userRecord.full_name, 'Customer'),
          phone: asString(userRecord.phone),
        }
      : null,
  }
}

export default function TaskerDashboard() {
  const router = useRouter()
  const [tasker, setTasker] = useState<TaskerProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'requests'|'active'|'history'|'earnings'|'profile'>('requests')
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace('/auth?type=tasker'); return }

      const { data: taskerData, error: taskerError } = await supabase
        .from('taskers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (taskerError) {
        if (isSchemaDriftError(taskerError)) {
          warnSchemaDrift('taskers dashboard lookup fallback', taskerError)
        } else {
          console.warn(
            `[Supabase contract] tasker dashboard lookup failed: ${getSupabaseErrorMessage(
              taskerError
            )}`
          )
        }
      }

      const t = normalizeTaskerProfile(taskerData)

      if (!t) { router.replace('/become-tasker'); return }
      setTasker(t)
      setIsOnline(t.is_online)

      let { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*, services(name_en,icon), users:customer_id(full_name,phone)')
        .eq('tasker_id', t.id)
        .order('created_at', { ascending: false })

      if (bookingsError && isSchemaDriftError(bookingsError)) {
        warnSchemaDrift('tasker bookings relation fallback', bookingsError)
        const fallbackResponse = await supabase
          .from('bookings')
          .select('*')
          .eq('tasker_id', t.id)
          .order('created_at', { ascending: false })
        bookingsData = fallbackResponse.data
        bookingsError = fallbackResponse.error
      }

      if (bookingsError) {
        if (isSchemaDriftError(bookingsError)) {
          warnSchemaDrift('tasker bookings minimal fallback', bookingsError)
        } else {
          console.warn(
            `[Supabase contract] tasker bookings lookup failed: ${getSupabaseErrorMessage(
              bookingsError
            )}`
          )
        }
        setBookings([])
      } else {
        setBookings((bookingsData || []).map((row) => normalizeBooking(row)).filter(Boolean) as Booking[])
      }
      setLoading(false)
    }
    load()
  }, [router])

  const toggleOnline = async () => {
    if (!tasker) return
    const next = !isOnline
    setIsOnline(next)
    await supabase.from('taskers').update({ is_online: next }).eq('id', tasker.id)
  }

  const acceptBooking = async (id: string) => {
    await supabase.from('bookings').update({ status: 'in-progress' }).eq('id', id)
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'in-progress' } : b))
  }

  const completeBooking = async (id: string) => {
    await supabase.from('bookings').update({ status: 'completed', payment_status: 'released' }).eq('id', id)
    await supabase.from('taskers').update({ total_tasks: (tasker?.total_tasks || 0) + 1 }).eq('id', tasker?.id)
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'completed' } : b))
  }

  const rejectBooking = async (id: string) => {
    await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  const requests = bookings.filter(b => b.status === 'pending')
  const active = bookings.filter(b => b.status === 'in-progress')
  const history = bookings.filter(b => ['completed','cancelled'].includes(b.status))
  const totalEarnings = history.filter(b => b.status === 'completed').reduce((s, b) => s + calcPayout(b.total_amount).payout, 0)

  const inp: React.CSSProperties = { border: `1.5px solid ${theme.border}`, borderRadius: '9px', padding: '10px 13px', fontSize: '14px', outline: 'none', width: '100%', fontFamily: theme.fontFamily }

  if (loading) return (
    <main style={{ fontFamily: theme.fontFamily }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: theme.muted }}>Loading dashboard...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, padding: '28px 5%', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>Tasker Dashboard / साथी ड्यासबोर्ड</h1>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>⭐ {tasker?.rating} rating · {tasker?.total_tasks} tasks · {tasker?.city}</p>
          </div>
          {/* Online toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', opacity: 0.9 }}>{isOnline ? '● Online' : '○ Offline'}</span>
            <div
              onClick={toggleOnline}
              style={{ width: '48px', height: '26px', borderRadius: '13px', background: isOnline ? '#16a34a' : 'rgba(255,255,255,0.3)', cursor: 'pointer', position: 'relative', transition: 'background .3s' }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: isOnline ? '25px' : '3px', transition: 'left .3s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
          {[
            { label: 'Pending Requests', val: requests.length, color: theme.amber },
            { label: 'Active Tasks', val: active.length, color: theme.blue },
            { label: 'Completed', val: history.filter(b=>b.status==='completed').length, color: theme.green },
            { label: 'Total Earnings', val: formatPrice(totalEarnings), color: theme.primary },
          ].map((s,i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '10px', padding: '14px 16px', border: `1px solid ${theme.border}` }}>
              <div style={{ fontSize: '10px', color: theme.muted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', border: `1px solid ${theme.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '18px', background: '#fff' }}>
          {([
            ['requests', `Requests (${requests.length})`],
            ['active', `Active (${active.length})`],
            ['history', 'History'],
            ['earnings', 'Earnings'],
            ['profile', 'Profile'],
          ] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '10px 6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, background: activeTab === tab ? theme.primary : '#fff', color: activeTab === tab ? '#fff' : theme.muted, fontFamily: theme.fontFamily }}>
              {label}
            </button>
          ))}
        </div>

        {/* Requests */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {requests.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
                <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No pending requests</h3>
                <p style={{ color: theme.muted }}>Make sure you are set to <strong>Online</strong> to receive bookings!</p>
              </div>
            ) : requests.map(b => (
              <div key={b.id} style={{ background: '#fff', borderRadius: '12px', border: `2px solid ${theme.amber}`, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{b.services?.icon} {b.services?.name_en}</div>
                    <div style={{ fontSize: '12px', color: theme.muted, marginBottom: '3px' }}>👤 {b.users?.full_name} · 📅 {formatDate(b.scheduled_at)}</div>
                    <div style={{ fontSize: '12px', color: theme.muted, marginBottom: '3px' }}>📍 {b.address}</div>
                    {b.task_description && <div style={{ fontSize: '12px', color: theme.muted }}>📝 {b.task_description.slice(0,100)}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#16a34a', marginBottom: '8px' }}>{formatPrice(b.total_amount)}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => rejectBooking(b.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '7px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>Decline</button>
                      <button onClick={() => acceptBooking(b.id)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '7px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>✓ Accept</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Active */}
        {activeTab === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {active.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '40px', textAlign: 'center', color: theme.muted }}>No active tasks right now.</div>
            ) : active.map(b => (
              <div key={b.id} style={{ background: '#fff', borderRadius: '12px', border: `2px solid ${theme.blue}`, padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>🔵 {b.services?.icon} {b.services?.name_en} — In Progress</div>
                    <div style={{ fontSize: '12px', color: theme.muted }}>📍 {b.address} · 👤 {b.users?.full_name}</div>
                    {b.users?.phone && <div style={{ fontSize: '12px', color: theme.blue, marginTop: '2px' }}>📞 +977{b.users.phone}</div>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#16a34a', marginBottom: '8px' }}>{formatPrice(b.total_amount)}</div>
                    <button onClick={() => completeBooking(b.id)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>✓ Mark Complete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '40px', textAlign: 'center', color: theme.muted }}>No task history yet.</div>
            ) : history.map(b => {
              const sc = statusColor(b.status)
              return (
                <div key={b.id} style={{ background: '#fff', borderRadius: '10px', border: `1px solid ${theme.border}`, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{b.services?.icon} {b.services?.name_en}</div>
                    <div style={{ fontSize: '12px', color: theme.muted }}>{formatDate(b.scheduled_at)} · Ref: {b.ref_code}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ ...sc, fontSize: '11px', padding: '3px 9px', borderRadius: '10px', fontWeight: 600 }}>{b.status}</span>
                    {b.status === 'completed' && <span style={{ fontWeight: 700, color: '#16a34a' }}>{formatPrice(calcPayout(b.total_amount).payout)}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Earnings */}
        {activeTab === 'earnings' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              {[
                { label: 'Total Earned', val: formatPrice(totalEarnings), color: '#16a34a' },
                { label: 'Platform Commission (12%)', val: formatPrice(Math.round(totalEarnings * 0.12 / 0.88)), color: theme.primary },
              ].map((s,i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '10px', padding: '18px', border: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '6px', textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: s.color }}>{s.val}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${theme.border}`, fontWeight: 700, fontSize: '14px' }}>Payout History</div>
              {history.filter(b => b.status === 'completed').slice(0, 10).map(b => (
                <div key={b.id} style={{ padding: '12px 18px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span>{b.services?.icon} {b.services?.name_en} · {formatDate(b.scheduled_at)}</span>
                  <strong style={{ color: '#16a34a' }}>+{formatPrice(calcPayout(b.total_amount).payout)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && tasker && (
          <div style={{ background: '#fff', borderRadius: '12px', border: `1px solid ${theme.border}`, padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>My Tasker Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Hourly Rate (Rs)</label><input type="number" defaultValue={tasker.hourly_rate} style={inp} /></div>
              <div><label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>City</label><input defaultValue={tasker.city} style={inp} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Bio</label><textarea defaultValue={tasker.bio} style={{ ...inp, minHeight: '80px', resize: 'vertical' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
              <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '9px', padding: '10px 22px', fontWeight: 700, cursor: 'pointer' }}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: '40px' }} />
    </main>
  )
}
