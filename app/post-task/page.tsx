'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'
import { generateRef } from '@/lib/helpers'

const SERVICES = ['Plumbing','Cleaning','Electrical','Tutoring','Moving','Cooking','Tech Help','Gardening','Caretaking','Painting','Driver','Pet Care','Other']
const CITIES = ['Kathmandu','Lalitpur','Bhaktapur','Pokhara','Chitwan','Butwal','Biratnagar']

export default function PostTaskPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [desc, setDesc] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [budget, setBudget] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [taskRef] = useState(() => generateRef())

  const inp: React.CSSProperties = {
    border: `1.5px solid ${theme.border}`, borderRadius: '9px', padding: '11px 14px',
    fontSize: '14px', outline: 'none', width: '100%', fontFamily: theme.fontFamily, color: theme.text
  }

  const handleSubmit = () => {
    if (desc && date && address && phone) setDone(true)
  }

  if (done) return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Task Posted Successfully!</h2>
        <p style={{ color: theme.muted, fontSize: '15px', marginBottom: '8px' }}>तपाईंको काम पोस्ट भयो! नजिकका साथीहरूलाई सूचना पठाइयो।</p>
        <div style={{ background: '#fff', border: `1px solid ${theme.border}`, borderRadius: theme.radiusMd, padding: '20px', margin: '24px 0', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', color: theme.muted, marginBottom: '8px' }}>TASK REFERENCE</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: theme.primary, letterSpacing: '2px', marginBottom: '8px' }}>
            {taskRef}
          </div>
          <p style={{ fontSize: '13px', color: theme.muted }}>Save this number. Nearby taskers will contact you via SMS at +977{phone}.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/browse')} style={{ background: '#fff', color: theme.text, border: `1.5px solid ${theme.border}`, borderRadius: '10px', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}>Browse Taskers</button>
          <button onClick={() => router.push('/')} style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer' }}>Go Home</button>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, padding: '36px 5%', color: '#fff', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px' }}>Post a Task / काम पोस्ट गर्नुस्</h1>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>Describe your task and get matched with nearby verified taskers</p>

        {/* Progress */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', marginTop: '24px', maxWidth: '400px', margin: '24px auto 0' }}>
          {['Service','Details','Contact'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', background: step > i + 1 ? theme.green : step === i + 1 ? '#fff' : 'rgba(255,255,255,0.3)', color: step > i + 1 ? '#fff' : step === i + 1 ? theme.primary : '#fff' }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '10px', opacity: step === i + 1 ? 1 : 0.6 }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > i + 1 ? theme.green : 'rgba(255,255,255,0.3)', marginBottom: '18px' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '32px auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${theme.border}`, padding: '30px', boxShadow: theme.shadow }}>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>What do you need done?</h2>
              <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '20px' }}>Select the service you need / सेवा छान्नुस्</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}>
                {SERVICES.map(s => (
                  <div key={s} onClick={() => setService(s)} style={{ border: `2px solid ${service === s ? theme.primary : theme.border}`, borderRadius: '10px', padding: '14px 8px', textAlign: 'center', cursor: 'pointer', background: service === s ? theme.primaryLight : '#fff', transition: 'all .15s' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: service === s ? theme.primary : theme.text }}>{s}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>DESCRIBE YOUR TASK *</label>
                <textarea
                  placeholder="e.g. My kitchen tap is leaking, need it fixed today. / मेरो भान्साको धारा बिग्रेको छ..."
                  value={desc} onChange={e => setDesc(e.target.value)}
                  style={{ ...inp, minHeight: '100px', resize: 'vertical' } as React.CSSProperties}
                />
              </div>

              <button
                onClick={() => { if (service && desc) setStep(2) }}
                disabled={!service || !desc}
                style={{ width: '100%', padding: '13px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: (!service || !desc) ? 0.6 : 1 }}
              >
                Next: Add Details →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>When & Where?</h2>
              <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '20px' }}>Tell us the date, time and location</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>DATE *</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>TIME</label>
                  <select value={time} onChange={e => setTime(e.target.value)} style={inp}>
                    <option value="">Any time</option>
                    {['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>CITY *</label>
                  <select value={city} onChange={e => setCity(e.target.value)} style={inp}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>BUDGET (Rs) — Optional</label>
                  <input type="number" placeholder="e.g. 1500" value={budget} onChange={e => setBudget(e.target.value)} style={inp} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>FULL ADDRESS *</label>
                <input type="text" placeholder="Street, area, landmark... / टोल, वडा, ल्यान्डमार्क..." value={address} onChange={e => setAddress(e.target.value)} style={inp} />
              </div>

              {/* Photo upload */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>ATTACH PHOTOS — Optional</label>
                <div
                  style={{ border: `2px dashed ${theme.border}`, borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: '#fafafa' }}
                  onClick={() => setPhotos([...photos, `photo${photos.length + 1}.jpg`])}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📷</div>
                  <p style={{ fontSize: '13px', color: theme.muted }}>Click to add photos of the task</p>
                </div>
                {photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    {photos.map((p, i) => (
                      <div key={i} style={{ background: theme.greenBg, color: theme.green, fontSize: '11px', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ✓ {p}
                        <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.green, fontWeight: 700 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: '#fff', border: `1.5px solid ${theme.border}`, borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                <button onClick={() => { if (date && address) setStep(3) }} disabled={!date || !address} style={{ flex: 2, padding: '12px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: (!date || !address) ? 0.6 : 1 }}>Next: Contact Info →</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Your Contact Info</h2>
              <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '20px' }}>Taskers will contact you via SMS</p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '6px' }}>PHONE NUMBER * / फोन नम्बर</label>
                <div style={{ display: 'flex', border: `1.5px solid ${theme.border}`, borderRadius: '9px', overflow: 'hidden' }}>
                  <span style={{ padding: '11px 14px', background: '#f9f9f9', color: theme.muted, borderRight: `1px solid ${theme.border}`, fontSize: '14px' }}>+977</span>
                  <input type="tel" placeholder="98XXXXXXXX" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} style={{ flex: 1, border: 'none', outline: 'none', padding: '11px 14px', fontSize: '14px' }} />
                </div>
              </div>

              {/* Summary */}
              <div style={{ background: theme.bg, borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Task Summary</div>
                {[
                  ['Service', service],
                  ['Date', `${date} ${time}`],
                  ['City', city],
                  ['Address', address],
                  ['Budget', budget ? `Rs ${budget}` : 'Flexible'],
                  ['Photos', photos.length ? `${photos.length} attached` : 'None'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '5px 0', borderBottom: `1px solid ${theme.border}` }}>
                    <span style={{ color: theme.muted }}>{l}</span>
                    <strong style={{ maxWidth: '200px', textAlign: 'right' }}>{v}</strong>
                  </div>
                ))}
              </div>

              <div style={{ background: theme.amberBg, borderRadius: '9px', padding: '12px', fontSize: '12px', color: '#92400e', marginBottom: '20px' }}>
                <strong>🔒 Your privacy is protected.</strong> Your phone number is only shared with the tasker you choose to hire.
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '12px', background: '#fff', border: `1.5px solid ${theme.border}`, borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>← Back</button>
                <button onClick={handleSubmit} disabled={phone.length !== 10} style={{ flex: 2, padding: '12px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: phone.length !== 10 ? 0.6 : 1 }}>
                  🚀 Post My Task — पोस्ट गर्नुस्
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
