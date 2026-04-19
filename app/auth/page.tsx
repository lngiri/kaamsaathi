'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'input' | 'otp'>('input')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Email Magic Link Login
  const sendMagicLink = async () => {
    if (!email.includes('@')) {
      setMessage('❌ Please enter a valid email')
      return
    }
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email
    })
    
    if (error) setMessage('❌ ' + error.message)
    else setMessage('✅ Magic link sent! Check your email.')
    setLoading(false)
  }

  // Phone OTP Login
  const sendOTP = async () => {
    if (!phone.match(/^98\d{8}$/)) {
      setMessage('❌ Enter valid Nepali number (98XXXXXXXX)')
      return
    }
    setLoading(true)
    setMessage('')
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+977${phone}`
    })
    
    if (error) setMessage('❌ ' + error.message)
    else {
      setMessage('✅ OTP sent! Check your phone or Supabase logs.')
      setStep('otp')
    }
    setLoading(false)
  }

  // Verify Phone OTP
  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) return setMessage('❌ Enter the 6-digit OTP')
    setLoading(true)
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+977${phone}`,
      token: otp,
      type: 'sms'
    })
    
    if (error) {
      setMessage('❌ ' + error.message)
    } else {
      setMessage('✅ Login successful! Saving profile...')
      await supabase.from('users').upsert({
        id: data.user.id,
        phone: phone,
        full_name: `User ${phone.slice(-4)}`,
        role: 'customer',
        city: 'Kathmandu'
      }, { onConflict: 'id' })
      
      setTimeout(() => router.push('/'), 1000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-1 text-gray-900">Login / साइन इन</h2>
        <p className="text-gray-500 text-center mb-6 text-sm">Choose your preferred login method</p>

        {/* Method Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setLoginMethod('email'); setStep('input'); setMessage('') }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              loginMethod === 'email' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📧 Email
          </button>
          <button
            onClick={() => { setLoginMethod('phone'); setStep('input'); setMessage('') }}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              loginMethod === 'phone' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📱 Phone
          </button>
        </div>

        {/* Email Login */}
        {loginMethod === 'email' && step === 'input' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
            <button
              onClick={sendMagicLink}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {loading ? '⏳ Sending...' : '📨 Send Magic Link'}
            </button>
          </div>
        )}

        {/* Phone Login - Step 1 */}
        {loginMethod === 'phone' && step === 'input' && (
          <div className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+977</span>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              />
            </div>
            <button
              onClick={sendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '⏳ Sending...' : '📩 Send OTP / OTP पठाउनुहोस्'}
            </button>
          </div>
        )}

        {/* Phone Login - Step 2 (OTP) */}
        {loginMethod === 'phone' && step === 'otp' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition text-center text-lg tracking-widest"
            />
            <button
              onClick={verifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '⏳ Verifying...' : '✅ Verify OTP / पुष्टि गर्नुहोस्'}
            </button>
            <button onClick={() => { setStep('input'); setOtp(''); setMessage('') }} className="text-sm text-gray-500 hover:text-emerald-600 w-full text-center">
              ← Change number / नम्बर बदल्नुहोस्
            </button>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
            message.startsWith('✅') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our</p>
          <p>
            <a href="#" className="text-emerald-600 hover:underline">Terms & Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}