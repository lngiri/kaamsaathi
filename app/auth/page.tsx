'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { theme } from '@/lib/theme'
import { ensureUserRecords, storeReferral } from '@/lib/appAuth'

function AuthContent() {
  const router = useRouter()
  const params = useSearchParams()
  const type = params.get('type') || 'customer'
  const ref = params.get('ref')
  const isTasker = type === 'tasker'
  const defaultMode: 'login' | 'signup' =
    type === 'login' ? 'login' : 'signup'

  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'input' | 'otp'>('input')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (ref) {
      storeReferral(ref)
    }
  }, [ref])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) return

        await ensureUserRecords(session.user, isTasker ? 'tasker' : 'customer')
        router.push(isTasker ? '/become-tasker' : '/dashboard/customer')
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [isTasker, router])

  const sendMagicLink = async () => {
    if (!email.includes('@')) return setMsg('❌ Please enter a valid email')
    setLoading(true)
    
    // URGENT FIX: Always use production URL for magic links
    // This overrides any environment variable or localhost detection
    // Supabase magic links MUST point to the production site
    const productionSiteUrl = 'https://kaamsaathi.pages.dev'
    
    // Construct the redirect URL for Supabase
    // Supabase will append #access_token=... to this URL
    const redirectUrl = `${productionSiteUrl}/auth?type=${type}${ref ? `&ref=${ref}` : ''}`
    
    // Log for debugging
    console.log('URGENT FIX - Using production URL:', productionSiteUrl)
    console.log('URGENT FIX - Redirect URL:', redirectUrl)
    console.log('URGENT FIX - Current env var:', process.env.NEXT_PUBLIC_SITE_URL)
    console.log('URGENT FIX - Window origin:', typeof window !== 'undefined' ? window.location.origin : 'undefined')
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })
    if (error) {
      setMsg('❌ ' + error.message)
    } else {
      setMsg('✅ Magic link sent! Check your email.')
    }
    setLoading(false)
  }

  const sendOTP = async () => {
    if (!phone.match(/^98\d{8}$/)) return setMsg('❌ Enter valid Nepali number (98XXXXXXXX)')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ phone: `+977${phone}` })
    if (error) setMsg('❌ ' + error.message)
    else { setMsg('✅ OTP sent!'); setStep('otp') }
    setLoading(false)
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) return setMsg('❌ Enter 6-digit OTP')
    setLoading(true)
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+977${phone}`, token: otp, type: 'sms'
    })
    if (error) {
      setMsg('❌ ' + error.message)
    } else {
      if (data.user) {
        await ensureUserRecords(data.user, isTasker ? 'tasker' : 'customer')
      }
      setMsg('✅ Success! Redirecting...')
      setTimeout(() => router.push(isTasker ? '/become-tasker' : '/dashboard/customer'), 1000)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: theme.fontFamily }}>
      <div style={{
        width: '420px', background: `linear-gradient(160deg, ${theme.secondary}, ${theme.primary})`,
        color: '#fff', padding: '48px 36px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', flexShrink: 0
      }}>
        <div
          onClick={() => router.push('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px', height: '42px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: '20px'
          }}>क</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700 }}>KaamSathi</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>काम साथी</div>
          </div>
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>
          {isTasker ? 'Join as a Tasker' : 'Find a Tasker'}
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: 1.7, marginBottom: '32px' }}>
          {isTasker
            ? 'Earn Rs 600-1,500/hr doing what you love. Set your own schedule and work near home.'
            : 'Get any task done by trusted local professionals. Fast, safe, and affordable.'}
        </p>

        {[
          isTasker ? 'Earn Rs 600-1,500/hr' : '2,400+ verified taskers',
          isTasker ? 'Work on your schedule' : 'Find taskers nearby',
          isTasker ? 'Insurance included' : 'Pay via eSewa / Khalti',
          isTasker ? 'Free app & tools' : 'Real reviews & ratings'
        ].map((benefit, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '14px' }}>
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', padding: '40px 20px' }}>
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '36px',
          width: '100%', maxWidth: '420px',
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadowLg
        }}>
          <div style={{ display: 'flex', marginBottom: '24px', border: `1.5px solid ${theme.border}`, borderRadius: '10px', overflow: 'hidden' }}>
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  background: mode === m ? theme.primary : '#fff',
                  color: mode === m ? '#fff' : theme.muted
                }}
              >
                {m === 'login' ? 'Login / साइन इन' : 'Sign Up / दर्ता'}
              </button>
            ))}
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: theme.text }}>
            {mode === 'login' ? 'Welcome back!' : isTasker ? 'Create Tasker Account' : 'Create Customer Account'}
          </h3>
          <p style={{ fontSize: '13px', color: theme.muted, marginBottom: '20px' }}>
            {mode === 'login' ? 'Sign in to your KaamSathi account' : `Sign up as a ${isTasker ? 'Tasker' : 'Customer'}`}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            {(['email', 'phone'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMethod(m); setStep('input'); setMsg('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '8px', border: `1.5px solid ${method === m ? theme.primary : theme.border}`,
                  background: method === m ? theme.primaryLight : '#fff',
                  color: method === m ? theme.primary : theme.muted,
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600
                }}
              >
                {m === 'email' ? 'Email' : 'Phone / फोन'}
              </button>
            ))}
          </div>

          {method === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ border: `1.5px solid ${theme.border}`, borderRadius: '9px', padding: '11px 14px', fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={sendMagicLink} disabled={loading}
                style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </div>
          )}

          {method === 'phone' && step === 'input' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', border: `1.5px solid ${theme.border}`, borderRadius: '9px', overflow: 'hidden' }}>
                <span style={{ padding: '11px 14px', background: '#f9f9f9', color: theme.muted, fontSize: '14px', borderRight: `1px solid ${theme.border}` }}>+977</span>
                <input
                  type="tel" placeholder="98XXXXXXXX" value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '11px 14px', fontSize: '14px' }}
                />
              </div>
              <button
                onClick={sendOTP} disabled={loading || phone.length !== 10}
                style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: (loading || phone.length !== 10) ? 0.6 : 1 }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          )}

          {method === 'phone' && step === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: theme.muted }}>Enter the 6-digit OTP sent to +977{phone}</p>
              <input
                type="text" placeholder="• • • • • •" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{ border: `1.5px solid ${theme.border}`, borderRadius: '9px', padding: '12px', fontSize: '22px', textAlign: 'center', letterSpacing: '8px', outline: 'none' }}
              />
              <button
                onClick={verifyOTP} disabled={loading || otp.length !== 6}
                style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: (loading || otp.length !== 6) ? 0.6 : 1 }}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button onClick={() => { setStep('input'); setOtp(''); setMsg('') }} style={{ background: 'none', border: 'none', color: theme.muted, cursor: 'pointer', fontSize: '13px' }}>
                Change number
              </button>
            </div>
          )}

          {msg && (
            <div style={{
              marginTop: '14px', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', textAlign: 'center',
              background: msg.startsWith('✅') ? theme.greenBg : theme.primaryLight,
              color: msg.startsWith('✅') ? theme.green : theme.primary
            }}>{msg}</div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: theme.muted }}>
            {isTasker ? (
              <span>Want to hire instead? <button onClick={() => router.push('/auth?type=customer')} style={{ color: theme.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Sign up as Customer</button></span>
            ) : (
              <span>Want to earn? <button onClick={() => router.push('/auth?type=tasker')} style={{ color: theme.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Join as Tasker</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Segoe UI' }}>Loading...</div>}>
      <AuthContent />
    </Suspense>
  )
}
