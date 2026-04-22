'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { theme } from '@/lib/theme'
import { generateRef, today, isValidPhone, calcPayout } from '@/lib/helpers'
import { NEPAL_CITIES } from '@/lib/helpers'
import {
  ensureProfileRow,
  getProfileSnapshot,
  insertOptionalPayment,
  insertOptionalReferralPayout,
  updateProfilePoints,
} from '@/lib/appAuth'
import {
  getSupabaseErrorMessage,
  isSchemaDriftError,
  warnSchemaDrift,
} from '@/lib/supabaseSafe'

type Tasker = {
  id: string
  hourly_rate: number
  city: string
  skills: string[]
  users?: { full_name: string; phone?: string }
}

type Props = {
  tasker: Tasker
  onClose: () => void
  serviceId?: string
}

async function createBookingWithFallback(payload: {
  ref_code: string
  customer_id: string
  tasker_id: string
  service_id: string | null
  task_description: string
  address: string
  scheduled_at: string
  duration_hrs: number
  total_amount: number
  repeat_weekly: boolean
  points_earned: number
  points_redeemed: number
  discount_amount: number
  payment_method: string
  status: string
  payment_status: string
}) {
  const variants = [
    payload,
    {
      ref_code: payload.ref_code,
      customer_id: payload.customer_id,
      tasker_id: payload.tasker_id,
      service_id: payload.service_id,
      task_description: payload.task_description,
      address: payload.address,
      scheduled_at: payload.scheduled_at,
      duration_hrs: payload.duration_hrs,
      total_amount: payload.total_amount,
      payment_method: payload.payment_method,
      status: payload.status,
      payment_status: payload.payment_status,
    },
    {
      ref_code: payload.ref_code,
      customer_id: payload.customer_id,
      tasker_id: payload.tasker_id,
      task_description: payload.task_description,
      address: payload.address,
      scheduled_at: payload.scheduled_at,
      total_amount: payload.total_amount,
      status: payload.status,
    },
  ]

  let lastError: { message?: string } | null = null

  for (const variant of variants) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(variant)
      .select('id')
      .single()

    if (!error) {
      return { booking: data, error: null }
    }

    lastError = error

    if (!isSchemaDriftError(error)) {
      return { booking: null, error }
    }

    warnSchemaDrift('bookings insert fallback', error)
  }

  return { booking: null, error: lastError }
}

export default function BookingModal({ tasker, onClose, serviceId }: Props) {
  const [step, setStep] = useState<'form' | 'confirm' | 'done'>('form')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM')
  const [hours, setHours] = useState(2)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState(tasker.city)
  const [desc, setDesc] = useState('')
  const [phone, setPhone] = useState('')
  const [payment, setPayment] = useState('eSewa')
  const [repeatWeekly, setRepeatWeekly] = useState(false)
  const [pointsBalance, setPointsBalance] = useState(0) // Mock user points balance
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [loading, setLoading] = useState(false)
  const [referralDiscount, setReferralDiscount] = useState(0)
  const [ref, setRef] = useState('')
  const [error, setError] = useState('')

  // Lock background scroll when modal is open
  useEffect(() => {
    async function checkFirstBookingReferral() {
      // Fetch user profile to get points balance
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await ensureProfileRow(user.id)
      const profileData = await getProfileSnapshot(user.id)

      if (profileData) {
        setPointsBalance(profileData.points || 0)
      }

      // Check if user has any previous bookings
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('customer_id', user.id)

      if (error) {
        if (isSchemaDriftError(error)) {
          warnSchemaDrift('bookings count fallback', error)
        } else {
          console.warn(
            `[Supabase contract] bookings count failed: ${getSupabaseErrorMessage(error)}`
          )
        }
      }

      if ((count ?? 0) === 0 && profileData?.referredBy) {
        setReferralDiscount(100)
      }
    }

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    checkFirstBookingReferral()
    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [])

  const subtotal = tasker.hourly_rate * hours
  let total = subtotal
  if (referralDiscount > 0) total -= referralDiscount
  if (repeatWeekly) total *= 0.9 // 10% discount for repeat weekly
  if (pointsToRedeem > 0) total -= pointsToRedeem
  const { commission, payout } = calcPayout(subtotal)

  const inp: React.CSSProperties = {
    border: `1.5px solid ${theme.border}`, borderRadius: '9px',
    padding: '10px 13px', fontSize: '14px', outline: 'none',
    width: '100%', fontFamily: theme.fontFamily, color: theme.text,
    background: '#fff'
  }

  const handleSubmit = async () => {
    setError('')
    if (!date) return setError('Please select a date')
    if (!address.trim()) return setError('Please enter your address')
    if (pointsToRedeem > pointsBalance) return setError('Not enough points to redeem.')
    if (pointsToRedeem < 0) return setError('Points to redeem cannot be negative.')
    if (pointsToRedeem > total) return setError('Points redeemed cannot exceed total amount.')

    if (!isValidPhone(phone)) return setError('Enter valid Nepali phone (98XXXXXXXX)')

    setLoading(true)
    try {
      const bookingRef = generateRef()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.assign('/auth?type=customer')
        return
      }
      await ensureProfileRow(user.id)

      const profileData = await getProfileSnapshot(user.id)
      const { booking, error: err } = await createBookingWithFallback({
        ref_code: bookingRef,
        customer_id: user.id,
        tasker_id: tasker.id,
        service_id: serviceId || null,
        task_description: desc,
        address: `${address}, ${city}`,
        scheduled_at: new Date(`${date} ${time}`).toISOString(),
        duration_hrs: hours,
        total_amount: total,
        repeat_weekly: repeatWeekly,
        points_earned: Math.floor(total / 100) * 10,
        points_redeemed: pointsToRedeem,
        discount_amount: referralDiscount,
        payment_method: payment,
        status: 'pending',
        payment_status: 'unpaid',
      })

      if (err || !booking) throw err || new Error('Booking could not be created.')

      await updateProfilePoints(
        user.id,
        pointsBalance + Math.floor(total / 100) * 10 - pointsToRedeem
      )

      if (referralDiscount > 0 && profileData.referredBy) {
        await insertOptionalReferralPayout({
          referrer_id: profileData.referredBy,
          referee_id: user.id,
          amount: 100,
          status: 'pending',
        })
      }

      await insertOptionalPayment({
        booking_id: booking.id,
        amount: total,
        method: payment,
        commission,
        tasker_payout: payout,
        status: 'pending',
      })

      setRef(bookingRef)
      setStep('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '40px 20px',
        fontFamily: theme.fontFamily,
        overflowY: 'auto', // Enable scrolling for the overlay
        backdropFilter: 'blur(4px)', // Optional: nicer UI
        overscrollBehavior: 'contain', // Prevent background scroll chaining
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: '16px', width: '480px', maxWidth: '100%', overflow: 'hidden', boxShadow: theme.shadowLg, margin: 'auto', flexShrink: 0 }}
      >
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, #003893, #DC143C)`, color: '#fff', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '2px' }}>
              {step === 'done' ? '🎉 Booking Confirmed!' : `Book ${tasker.users?.full_name || 'Tasker'}`}
            </h3>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>
              {step === 'done' ? 'बुकिङ सफल भयो!' : `Rs ${tasker.hourly_rate}/hr · ${tasker.city}`}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        {/* Done State */}
        {step === 'done' && (
          <div style={{ padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
            <div style={{ background: theme.bg, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: theme.muted, marginBottom: '6px', textTransform: 'uppercase' }}>Booking Reference</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: theme.primary, letterSpacing: '2px' }}>{ref}</div>
              <p style={{ fontSize: '12px', color: theme.muted, marginTop: '6px' }}>Save this number / यो नम्बर सुरक्षित राख्नुस्</p>
            </div>
            <p style={{ fontSize: '13px', color: theme.muted, marginBottom: '20px' }}>
              {tasker.users?.full_name} will contact you at +977{phone} shortly. Payment due on completion.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', border: `1.5px solid ${theme.border}`, borderRadius: '10px', fontWeight: 600, cursor: 'pointer', background: '#fff' }}>Close</button>
              <button
                onClick={() => window.location.href = '/dashboard/customer'}
                style={{ flex: 1, padding: '12px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
              >
                My Bookings →
              </button>
            </div>
          </div>
        )}

        {/* Form State */}
        {step === 'form' && (
          <div style={{ padding: '22px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} min={today()} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Time</label>
                <select value={time} onChange={e => setTime(e.target.value)} style={inp}>
                  {['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Duration</label>
                <select value={hours} onChange={e => setHours(Number(e.target.value))} style={inp}>
                  {[1,2,3,4,6,8].map(h => <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''} — Rs {tasker.hourly_rate * h}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>City</label>
                <select value={city} onChange={e => setCity(e.target.value)} style={inp}>
                  {NEPAL_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Your Address *</label>
                <input type="text" placeholder="Street, area, landmark..." value={address} onChange={e => setAddress(e.target.value)} style={inp} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Task Description</label>
                <textarea placeholder="Describe what you need done..." value={desc} onChange={e => setDesc(e.target.value)} style={{ ...inp, minHeight: '70px', resize: 'vertical' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Your Phone *</label>
                <div style={{ display: 'flex', border: `1.5px solid ${theme.border}`, borderRadius: '9px', overflow: 'hidden' }}>
                  <span style={{ padding: '10px 12px', background: '#f9f9f9', color: theme.muted, borderRight: `1px solid ${theme.border}`, fontSize: '13px', flexShrink: 0 }}>+977</span>
                  <input type="tel" placeholder="98XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} style={{ ...inp, border: 'none', borderRadius: 0 }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>Payment Method</label>
                <select value={payment} onChange={e => setPayment(e.target.value)} style={inp}>
                  <option>eSewa</option>
                  <option>Khalti</option>
                  <option>Cash on Completion</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
            </div>
            
            {/* Repeat Weekly Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
              <input type="checkbox" id="repeatWeekly" checked={repeatWeekly} onChange={e => setRepeatWeekly(e.target.checked)} style={{ accentColor: theme.primary }} />
              <label htmlFor="repeatWeekly" style={{ fontSize: '14px', fontWeight: 600, color: theme.text }}>Repeat this task weekly (10% discount)</label>
            </div>

            {/* Points Redemption */}
            <div style={{ marginTop: '15px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>
                Your Points Balance: {pointsBalance} pts
              </label>
              <input
                type="number"
                placeholder="Points to redeem (500 pts = Rs 50 off)"
                value={pointsToRedeem}
                onChange={e => setPointsToRedeem(Math.min(pointsBalance, Number(e.target.value)))}
                style={inp}
              />
            </div>

            {/* Price summary */}
            <div style={{ background: theme.bg, borderRadius: '9px', padding: '12px 14px', margin: '14px 0', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: theme.muted }}>Subtotal ({hours} hr × Rs {tasker.hourly_rate})</span>
                {referralDiscount > 0 && <span style={{ color: theme.primary, fontSize: '12px', fontWeight: 600 }}>🎁 First Booking Discount: -Rs {referralDiscount}</span>}
                {repeatWeekly && <span style={{ color: theme.primary, fontSize: '12px', fontWeight: 600 }}>🔄 Weekly Repeat Discount: -10%</span>}
                {pointsToRedeem > 0 && <span style={{ color: theme.primary, fontSize: '12px', fontWeight: 600 }}>✨ Points Redeemed: -Rs {pointsToRedeem}</span>}
              </div>
              <div style={{ textAlign: 'right' }}>
                {referralDiscount > 0 && <div style={{ fontSize: '12px', textDecoration: 'line-through', color: theme.muted }}>Rs {subtotal.toLocaleString()}</div>}
                <strong style={{ color: '#16a34a', fontSize: '16px' }}>Rs {total.toLocaleString()}</strong>
              </div>
            </div>

            {error && (
              <div style={{ background: theme.primaryLight, color: theme.primary, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px' }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} style={{ flex: 1, padding: '12px', border: `1.5px solid ${theme.border}`, borderRadius: '10px', fontWeight: 600, cursor: 'pointer', background: '#fff' }}>Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={loading || !date || !address || phone.length !== 10}
                style={{ flex: 2, padding: '12px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: (loading || !date || !address || phone.length !== 10) ? 0.6 : 1 }}
              >
                {loading ? '⏳ Confirming...' : '🚀 Confirm Booking'}
              </button>
            </div>

            <div style={{ background: theme.amberBg, borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#92400e', marginTop: '12px' }}>
              🔒 Payment is held securely and released to the tasker only after task completion.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
