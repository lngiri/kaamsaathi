'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { theme } from '@/lib/theme'
import Navbar from '@/app/components/Navbar'

const TASKERS = [
  { id: 1, name: 'Ramesh Adhikari', nep: 'रा', city: 'Kathmandu', skills: ['Plumbing','Electrical'], rating: 5.0, tasks: 134, price: 800, dist: 1.2, online: true, gender: 'male', avail: 'now', bg: '#C0392B', bio: 'Expert plumber with 8 years experience. Available same day.' },
  { id: 2, name: 'Sunita Tamang', nep: 'सु', city: 'Lalitpur', skills: ['Cleaning','Cooking'], rating: 4.9, tasks: 87, price: 600, dist: 2.4, online: true, gender: 'female', avail: 'now', bg: '#1a7a4a', bio: 'Professional cleaner. Brings own supplies. Highly rated.' },
  { id: 3, name: 'Bikash Shrestha', nep: 'बि', city: 'Pokhara', skills: ['Moving','Painting'], rating: 4.8, tasks: 210, price: 700, dist: 5.1, online: false, gender: 'male', avail: 'today', bg: '#2563EB', bio: 'Strong and reliable mover. Can handle big apartments.' },
  { id: 4, name: 'Priya Gurung', nep: 'प्र', city: 'Bhaktapur', skills: ['Tutoring','Tech Help'], rating: 4.9, tasks: 56, price: 900, dist: 3.7, online: true, gender: 'female', avail: 'now', bg: '#7c3aed', bio: 'Ex-teacher. Teaches SLC to +2 all subjects. Very patient.' },
  { id: 5, name: 'Anil Maharjan', nep: 'अ', city: 'Kathmandu', skills: ['Gardening','Cleaning'], rating: 4.7, tasks: 92, price: 550, dist: 0.8, online: true, gender: 'male', avail: 'now', bg: '#0891b2', bio: 'Garden expert. Can also do deep cleaning.' },
  { id: 6, name: 'Rita Basnet', nep: 'रि', city: 'Chitwan', skills: ['Cooking','Caretaking'], rating: 4.8, tasks: 45, price: 650, dist: 8.2, online: false, gender: 'female', avail: 'today', bg: '#be185d', bio: 'Cooks authentic Nepali food. Also provides elderly care.' },
]

const CITIES = ['Kathmandu','Lalitpur','Bhaktapur','Pokhara','Chitwan','Butwal','Biratnagar']
const SERVICES = ['Plumbing','Cleaning','Electrical','Tutoring','Moving','Cooking','Tech Help','Gardening','Caretaking','Painting','Driver','Pet Care']

type Tasker = typeof TASKERS[0]

function BrowseContent() {
  const router = useRouter()
  const params = useSearchParams()

  const [city, setCity] = useState(params.get('city') || 'Kathmandu')
  const [search, setSearch] = useState(params.get('search') || '')
  const [selectedService, setSelectedService] = useState(params.get('search') || '')
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(2000)
  const [maxDist, setMaxDist] = useState(15)
  const [avail, setAvail] = useState<string[]>([])
  const [gender, setGender] = useState('any')
  const [view, setView] = useState<'grid'|'list'>('grid')
  const [selectedTasker, setSelectedTasker] = useState<Tasker | null>(null)
  const [showPostTask, setShowPostTask] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [bookingTasker, setBookingTasker] = useState<Tasker | null>(null)
  const [taskDesc, setTaskDesc] = useState('')
  const [taskAddr, setTaskAddr] = useState('')
  const [taskDate, setTaskDate] = useState('')
  const [bookingDone, setBookingDone] = useState(false)
  const [postDone, setPostDone] = useState(false)

  const filtered = TASKERS.filter(t => {
    const q = search.toLowerCase()
    return (
      (city === '' || t.city.toLowerCase().includes(city.toLowerCase())) &&
      (search === '' || t.name.toLowerCase().includes(q) || t.skills.some(s => s.toLowerCase().includes(q))) &&
      (selectedService === '' || t.skills.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))) &&
      t.rating >= minRating &&
      t.price <= maxPrice &&
      t.dist <= maxDist &&
      (avail.length === 0 || avail.includes(t.avail)) &&
      (gender === 'any' || t.gender === gender)
    )
  })

  const inp = (override?: Partial<React.CSSProperties>): React.CSSProperties => ({
    border: `1.5px solid ${theme.border}`, borderRadius: '9px', padding: '10px 13px',
    fontSize: '14px', outline: 'none', width: '100%', fontFamily: theme.fontFamily,
    ...override
  })

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, fontFamily: theme.fontFamily }}>
      <Navbar />

      {/* Profile Modal */}
      {selectedTasker && (
        <div onClick={() => setSelectedTasker(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', width: '440px', maxWidth: '95vw', overflow: 'hidden', boxShadow: theme.shadowLg }}>
            <div style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, color: '#fff', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: selectedTasker.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 700, border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0 }}>{selectedTasker.nep}</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>{selectedTasker.name}</h3>
                <p style={{ fontSize: '13px', opacity: 0.8 }}>📍 {selectedTasker.city} · ⭐ {selectedTasker.rating} ({selectedTasker.tasks} reviews)</p>
              </div>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {[
                ['Skills', selectedTasker.skills.join(', ')],
                ['Rate', `Rs ${selectedTasker.price}/hr`],
                ['Distance', `${selectedTasker.dist} km away`],
                ['Availability', selectedTasker.avail === 'now' ? '✅ Available Now' : 'Available Today'],
                ['About', selectedTasker.bio],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', gap: '12px', padding: '9px 0', borderBottom: `1px solid ${theme.border}`, fontSize: '13px' }}>
                  <span style={{ color: theme.muted, width: '90px', flexShrink: 0 }}>{label}</span>
                  <strong>{val}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                <button onClick={() => setSelectedTasker(null)} style={{ flex: 1, padding: '11px', border: `1.5px solid ${theme.border}`, borderRadius: '9px', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                <button onClick={() => { setSelectedTasker(null); setBookingTasker(selectedTasker); setShowBooking(true) }} style={{ flex: 2, padding: '11px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>📅 Book Now — अहिले बुक गर्नुस्</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && bookingTasker && (
        <div onClick={() => { setShowBooking(false); setBookingDone(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', width: '440px', maxWidth: '95vw', padding: '28px', boxShadow: theme.shadowLg }}>
            {bookingDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Booking Confirmed!</h3>
                <p style={{ color: theme.muted, fontSize: '14px', marginBottom: '8px' }}>बुकिङ सफल भयो! {bookingTasker.name} लाई SMS पठाइयो।</p>
                <div style={{ background: theme.bg, borderRadius: '10px', padding: '14px', margin: '16px 0', fontSize: '13px' }}>
                  <strong>Ref: KS-{Math.floor(1000 + Math.random() * 9000)}</strong><br />
                  <span style={{ color: theme.muted }}>Save this reference number</span>
                </div>
                <button onClick={() => { setShowBooking(false); setBookingDone(false) }} style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', padding: '11px 28px', fontWeight: 600, cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>Book {bookingTasker.name}</h3>
                <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '20px' }}>📍 {bookingTasker.city} · Rs {bookingTasker.price}/hr</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>DATE / मिति *</label>
                    <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)} style={inp()} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>YOUR ADDRESS / ठेगाना *</label>
                    <input type="text" placeholder="e.g. Thamel, Ward 26, Kathmandu" value={taskAddr} onChange={e => setTaskAddr(e.target.value)} style={inp()} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>DESCRIBE YOUR TASK / काम बताउनुस्</label>
                    <textarea placeholder="What exactly do you need done?" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} style={{ ...inp(), minHeight: '80px', resize: 'vertical' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>PAYMENT METHOD</label>
                    <select style={inp()}>
                      <option>📱 eSewa</option>
                      <option>💜 Khalti</option>
                      <option>💵 Cash on Completion</option>
                      <option>🏦 Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => setShowBooking(false)} style={{ flex: 1, padding: '11px', border: `1.5px solid ${theme.border}`, borderRadius: '9px', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button
                    onClick={() => { if (taskDate && taskAddr) setBookingDone(true) }}
                    disabled={!taskDate || !taskAddr}
                    style={{ flex: 2, padding: '11px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, opacity: (!taskDate || !taskAddr) ? 0.6 : 1 }}
                  >
                    🚀 Confirm Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Post Task Modal */}
      {showPostTask && (
        <div onClick={() => { setShowPostTask(false); setPostDone(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '16px', width: '480px', maxWidth: '95vw', padding: '28px', boxShadow: theme.shadowLg }}>
            {postDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>📋</div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Task Posted!</h3>
                <p style={{ color: theme.muted, fontSize: '14px', marginBottom: '16px' }}>तपाईंको काम पोस्ट भयो! नजिकका साथीहरूलाई सूचना पठाइयो।</p>
                <p style={{ fontSize: '13px', color: theme.muted }}>Nearby taskers will contact you shortly via SMS.</p>
                <button onClick={() => { setShowPostTask(false); setPostDone(false) }} style={{ marginTop: '20px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', padding: '11px 28px', fontWeight: 600, cursor: 'pointer' }}>Done</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px' }}>Post a Task / काम पोस्ट गर्नुस्</h3>
                <p style={{ color: theme.muted, fontSize: '13px', marginBottom: '20px' }}>Can&apos;t find the right tasker? Post your task and let taskers come to you!</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>SERVICE NEEDED *</label>
                    <select style={inp()}>
                      {SERVICES.map(s => <option key={s}>{s}</option>)}
                      <option>Other / अन्य</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>DESCRIBE YOUR TASK *</label>
                    <textarea placeholder="Describe exactly what you need... / आफ्नो काम विस्तारमा बताउनुस्..." value={taskDesc} onChange={e => setTaskDesc(e.target.value)} style={{ ...inp(), minHeight: '90px', resize: 'vertical' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>DATE *</label>
                      <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)} style={inp()} min={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>CITY *</label>
                      <select style={inp()}>
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>YOUR ADDRESS *</label>
                    <input type="text" placeholder="Street, area, landmark..." value={taskAddr} onChange={e => setTaskAddr(e.target.value)} style={inp()} />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>YOUR PHONE *</label>
                    <div style={{ display: 'flex', border: `1.5px solid ${theme.border}`, borderRadius: '9px', overflow: 'hidden' }}>
                      <span style={{ padding: '10px 13px', background: '#f9f9f9', color: theme.muted, borderRight: `1px solid ${theme.border}` }}>+977</span>
                      <input type="tel" placeholder="98XXXXXXXX" style={{ flex: 1, border: 'none', outline: 'none', padding: '10px 13px', fontSize: '14px' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: theme.muted, display: 'block', marginBottom: '5px' }}>BUDGET (Rs) — Optional</label>
                    <input type="number" placeholder="e.g. 1500" style={inp()} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => setShowPostTask(false)} style={{ flex: 1, padding: '11px', border: `1.5px solid ${theme.border}`, borderRadius: '9px', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  <button
                    onClick={() => { if (taskDesc && taskDate && taskAddr) setPostDone(true) }}
                    disabled={!taskDesc || !taskDate || !taskAddr}
                    style={{ flex: 2, padding: '11px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: 600, opacity: (!taskDesc || !taskDate || !taskAddr) ? 0.6 : 1 }}
                  >
                    📋 Post My Task
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Search Hero */}
      <div style={{ background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`, padding: '32px 5%', color: '#fff' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Find Taskers Near You / नजिकका साथीहरू खोज्नुस्</h1>
        <p style={{ fontSize: '13px', opacity: 0.75, marginBottom: '20px' }}>Browse 2,400+ verified taskers across Nepal</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '10px', overflow: 'hidden', flex: 1, minWidth: '260px' }}>
            <input
              type="text" placeholder="Search by name or service..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 16px', fontSize: '14px', color: theme.text }}
            />
            <select value={city} onChange={e => setCity(e.target.value)} style={{ border: 'none', borderLeft: `1px solid ${theme.border}`, outline: 'none', padding: '12px', fontSize: '14px', color: theme.muted, background: '#fff' }}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={() => setShowPostTask(true)}
            style={{ background: '#fff', color: theme.primary, border: 'none', borderRadius: '10px', padding: '12px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          >
            + Post a Task
          </button>
        </div>

        {/* Service Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <button onClick={() => setSelectedService('')} style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${selectedService === '' ? '#fff' : 'rgba(255,255,255,0.3)'}`, background: selectedService === '' ? '#fff' : 'transparent', color: selectedService === '' ? theme.primary : '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>All / सबै</button>
          {SERVICES.slice(0, 9).map(s => (
            <button key={s} onClick={() => setSelectedService(s === selectedService ? '' : s)} style={{ padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${selectedService === s ? '#fff' : 'rgba(255,255,255,0.3)'}`, background: selectedService === s ? '#fff' : 'transparent', color: selectedService === s ? theme.primary : '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '24px 20px', gap: '22px', alignItems: 'flex-start' }}>

        {/* Filters Sidebar */}
        <aside style={{ width: '240px', flexShrink: 0, background: '#fff', borderRadius: theme.radiusMd, border: `1px solid ${theme.border}`, padding: '20px', position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <strong style={{ fontSize: '14px' }}>Filters / फिल्टर</strong>
            <button onClick={() => { setMinRating(0); setMaxPrice(2000); setMaxDist(15); setAvail([]); setGender('any'); setSelectedService(''); setSearch('') }} style={{ fontSize: '11px', color: theme.primary, background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
          </div>

          {/* Availability */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>Availability</div>
            {[{id:'now',label:'Available Now',count:18},{id:'today',label:'Available Today',count:24},{id:'advance',label:'Book in Advance',count:42}].map(o => (
              <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', cursor: 'pointer', fontSize: '13px' }}>
                <input type="checkbox" checked={avail.includes(o.id)} onChange={e => setAvail(e.target.checked ? [...avail, o.id] : avail.filter(a => a !== o.id))} style={{ accentColor: theme.primary }} />
                <span style={{ flex: 1 }}>{o.label}</span>
                <span style={{ fontSize: '10px', color: theme.muted, background: theme.bg, padding: '1px 6px', borderRadius: '8px' }}>{o.count}</span>
              </label>
            ))}
          </div>

          {/* Price */}
          <div style={{ marginBottom: '16px', borderTop: `1px solid ${theme.border}`, paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>Max Price (Rs/hr)</div>
            <input type="range" min="200" max="2000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
            <div style={{ fontSize: '12px', color: theme.muted, textAlign: 'center', marginTop: '4px' }}>Up to Rs {maxPrice}/hr</div>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '16px', borderTop: `1px solid ${theme.border}`, paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>Min Rating</div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {[0,4,4.5,5].map(r => (
                <button key={r} onClick={() => setMinRating(r)} style={{ padding: '4px 8px', borderRadius: '7px', border: `1.5px solid ${minRating === r ? theme.primary : theme.border}`, background: minRating === r ? theme.primaryLight : '#fff', color: minRating === r ? theme.primary : theme.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                  {r === 0 ? 'All' : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div style={{ marginBottom: '16px', borderTop: `1px solid ${theme.border}`, paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>Distance</div>
            <input type="range" min="1" max="30" value={maxDist} onChange={e => setMaxDist(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
            <div style={{ fontSize: '12px', color: theme.muted, textAlign: 'center', marginTop: '4px' }}>Within {maxDist} km</div>
          </div>

          {/* Gender */}
          <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>Gender</div>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[{id:'any',label:'Any'},{id:'male',label:'Male'},{id:'female',label:'Female'}].map(g => (
                <button key={g.id} onClick={() => setGender(g.id)} style={{ flex: 1, padding: '5px 4px', borderRadius: '7px', border: `1.5px solid ${gender === g.id ? theme.primary : theme.border}`, background: gender === g.id ? theme.primaryLight : '#fff', color: gender === g.id ? theme.primary : theme.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: theme.muted }}><strong style={{ color: theme.text }}>{filtered.length}</strong> taskers found near {city}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select style={{ border: `1px solid ${theme.border}`, borderRadius: '8px', padding: '7px 10px', fontSize: '13px', outline: 'none', background: '#fff' }}>
                <option>Nearest First</option>
                <option>Highest Rated</option>
                <option>Price: Low → High</option>
                <option>Most Tasks Done</option>
              </select>
              <div style={{ display: 'flex', border: `1px solid ${theme.border}`, borderRadius: '8px', overflow: 'hidden' }}>
                {(['grid','list'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: '7px 12px', border: 'none', background: view === v ? theme.primary : '#fff', color: view === v ? '#fff' : theme.muted, cursor: 'pointer', fontSize: '14px' }}>
                    {v === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* No results */}
          {filtered.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: theme.radiusMd, border: `1px solid ${theme.border}`, padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>No taskers found!</h3>
              <p style={{ color: theme.muted, fontSize: '14px', marginBottom: '20px' }}>
                No taskers match your filters. You can post your task and let taskers come to you!
              </p>
              <button
                onClick={() => setShowPostTask(true)}
                style={{ background: theme.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '13px 28px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
              >
                📋 Post My Task — साथी खोज्नुस्
              </button>
            </div>
          ) : (
            <div style={{ display: view === 'grid' ? 'grid' : 'flex', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', flexDirection: 'column', gap: '16px' }}>
              {filtered.map(t => (
                <div key={t.id} style={{ background: '#fff', border: `1.5px solid ${theme.border}`, borderRadius: theme.radiusLg, overflow: 'hidden', display: view === 'list' ? 'flex' : 'block' }}>
                  <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', flex: view === 'list' ? 1 : 'unset' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', fontWeight: 700, color: '#fff', flexShrink: 0, position: 'relative' }}>
                      {t.nep}
                      <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '12px', height: '12px', borderRadius: '50%', background: t.online ? theme.green : '#ccc', border: '2px solid #fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{t.name}</h3>
                      <div style={{ fontSize: '12px', color: theme.muted, marginBottom: '4px' }}>📍 {t.city} · <span style={{ color: theme.blue }}>{t.dist} km</span></div>
                      <div style={{ fontSize: '12px', color: '#f59e0b' }}>★ <strong style={{ color: theme.text }}>{t.rating}</strong> <span style={{ color: theme.muted }}>({t.tasks} reviews)</span></div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {t.skills.map(s => <span key={s} style={{ background: theme.primaryLight, color: theme.primary, fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: 500 }}>{s}</span>)}
                        <span style={{ background: t.online ? theme.greenBg : '#f3f4f6', color: t.online ? theme.green : theme.muted, fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: 500 }}>{t.online ? '● Online' : '○ Offline'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: theme.green }}>Rs {t.price}<span style={{ fontSize: '10px', fontWeight: 400, color: theme.muted }}>/hr</span></div>
                      <div style={{ fontSize: '10px', color: theme.muted, marginTop: '2px' }}>{t.avail === 'now' ? '✅ Now' : 'Today'}</div>
                    </div>
                  </div>
                  <div style={{ padding: '10px 18px 14px', borderTop: view === 'list' ? 'none' : `1px solid ${theme.border}`, display: 'flex', gap: '8px', borderLeft: view === 'list' ? `1px solid ${theme.border}` : 'none', alignItems: 'center' }}>
                    <button onClick={() => { setBookingTasker(t); setShowBooking(true) }} style={{ flex: 1, padding: '8px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>📅 Book Now</button>
                    <button onClick={() => setSelectedTasker(t)} style={{ flex: 1, padding: '8px', background: '#fff', color: theme.text, border: `1.5px solid ${theme.border}`, borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>👤 View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Post task banner */}
          {filtered.length > 0 && (
            <div style={{ marginTop: '24px', background: `linear-gradient(90deg, ${theme.secondary}, ${theme.primary})`, borderRadius: theme.radiusMd, padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ color: '#fff' }}>
                <strong style={{ fontSize: '14px', display: 'block' }}>Can&apos;t find the right tasker?</strong>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Post your task and let taskers come to you!</span>
              </div>
              <button onClick={() => setShowPostTask(true)} style={{ background: '#fff', color: theme.primary, border: 'none', borderRadius: '9px', padding: '10px 20px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                + Post a Task
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>}>
      <BrowseContent />
    </Suspense>
  )
}