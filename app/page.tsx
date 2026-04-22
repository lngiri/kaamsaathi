'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import TaskerCard from '@/app/components/TaskerCard'
import {
  asNumber,
  asRecord,
  asString,
  getSupabaseErrorMessage,
  isSchemaDriftError,
  warnSchemaDrift,
} from '@/lib/supabaseSafe'

type Service = {
  id: string
  name_en: string
  name_np: string
  icon: string
  base_price: number
  category?: string
  rating?: number
}

function normalizeService(row: unknown): Service | null {
  const record = asRecord(row)
  if (!record) return null

  return {
    id: asString(record.id),
    name_en: asString(record.name_en, asString(record.name_np, 'Service')),
    name_np: asString(record.name_np),
    icon: asString(record.icon, '🛠'),
    base_price: asNumber(record.base_price, 0),
    category: asString(record.category),
    rating: asNumber(record.rating, 0),
  }
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const router = useRouter()

  useEffect(() => {
    async function fetchServices() {
      try {
        let { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('name_en')

        if (error && isSchemaDriftError(error)) {
          warnSchemaDrift('services homepage filtered query fallback', error)
          const fallbackResponse = await supabase.from('services').select('*')
          data = fallbackResponse.data
          error = fallbackResponse.error
        }

        if (error && isSchemaDriftError(error)) {
          warnSchemaDrift('services homepage minimal fallback', error)
          setServices([])
          return
        }

        if (error) throw error

        const rawData = (data || [])
          .map((item) => normalizeService(item))
          .filter(Boolean) as Service[]
        const uniqueMap = new Map<string, Service>()

        rawData.forEach((item) => {
          const key = `${item.name_en}|${item.category || 'default'}`
          const existing = uniqueMap.get(key)

          if (!existing || (item.rating || 0) > (existing.rating || 0)) {
            uniqueMap.set(key, item)
          }
        })

        setServices(Array.from(uniqueMap.values()))
      } catch (err) {
        console.error(
          'Failed to load services:',
          err instanceof Error ? err.message : getSupabaseErrorMessage(err)
        )
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleSearch = () => {
    router.push(`/browse?search=${encodeURIComponent(search)}&city=${city}`)
  }

  const handleServiceClick = (name: string) => {
    router.push(`/browse?search=${encodeURIComponent(name)}&city=${city}`)
  }

  return (
    <main style={{ fontFamily: "'Segoe UI', sans-serif", color: '#1a1a1a', background: '#fff', minHeight: '100vh' }}>

      {/* ===== HERO ===== */}
      <header style={{ background: 'linear-gradient(135deg,#FFF5F5 0%, #F0F4FF 100%)', padding: '70px 5% 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#fff', border: '1px solid #e8e8e8', borderRadius: '20px',
          padding: '5px 14px', fontSize: '12px', color: '#666', marginBottom: '24px'
        }}>
          <span style={{ color: '#16a34a', fontSize: '11px' }}>●</span>
          2,400+ verified taskers across Nepal &nbsp;|&nbsp; नेपालभर विश्वसनीय साथीहरू
        </div>

        <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '10px' }}>
          Get Any Task Done — <span style={{ color: '#DC143C' }}>Right Here in Nepal</span>
        </h1>
        <div style={{ fontSize: 'clamp(16px,2.5vw,22px)', color: '#666', marginBottom: '18px', fontWeight: 500 }}>
          जुनसुकै काम, नेपालमै गराउनुस् — सजिलो, छिटो, भरपर्दो
        </div>
        <p style={{ fontSize: '16px', color: '#666', maxWidth: '560px', margin: '0 auto 36px' }}>
          From home repairs to tutoring, find trusted local taskers in Kathmandu, Pokhara, Chitwan & beyond.
        </p>

        {/* Search Bar */}
        <div style={{
          display: 'flex', background: '#fff', border: '2px solid #e8e8e8',
          borderRadius: '14px', maxWidth: '640px', margin: '0 auto 28px',
          overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,56,147,0.1)'
        }}>
          <input
            type="text"
            placeholder="What do you need done? (e.g. Plumber, Cleaner)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, border: 'none', outline: 'none', padding: '14px 18px', fontSize: '15px', background: 'transparent' }}
          />
          <select
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{ border: 'none', borderLeft: '1px solid #e8e8e8', outline: 'none', padding: '14px', fontSize: '14px', color: '#666', background: '#fff', cursor: 'pointer' }}
          >
            {['Kathmandu','Pokhara','Lalitpur','Bhaktapur','Chitwan','Butwal','Biratnagar'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            style={{ background: '#DC143C', color: '#fff', border: 'none', padding: '14px 24px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            Search / खोज्नुस्
          </button>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <button
            onClick={() => router.push('/browse')}
            style={{ background: '#DC143C', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            🔍 Find a Tasker
          </button>
          <button
            onClick={() => router.push('/auth')}
            style={{ background: '#fff', color: '#003893', border: '1.5px solid #003893', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            💼 Become a Tasker
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { val: '2,400+', label: 'Verified Taskers', np: 'प्रमाणित साथीहरू' },
            { val: '15,000+', label: 'Tasks Completed', np: 'सम्पन्न कामहरू' },
            { val: '4.8★', label: 'Average Rating', np: 'औसत मूल्यांकन' },
            { val: '30 min', label: 'Avg. Match Time', np: 'औसत मिलान समय' }
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <strong style={{ display: 'block', fontSize: '22px', fontWeight: 700, color: '#003893' }}>{s.val}</strong>
              <span style={{ fontSize: '12px', color: '#666' }}>{s.label}<br />{s.np}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ===== SERVICES ===== */}
      <section id="services" style={{ padding: '60px 5%' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>
          Popular Services / लोकप्रिय सेवाहरू
        </h2>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '15px', marginBottom: '36px' }}>
          Browse top service categories trusted by thousands of Nepali households
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading services...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '14px' }}>
            {services.map(s => (
              <div
                key={s.id}
                onClick={() => handleServiceClick(s.name_en)}
                style={{
                  background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '14px',
                  padding: '20px 14px', textAlign: 'center', cursor: 'pointer',
                  transition: 'all .2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#DC143C')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
              >
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>{s.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{s.name_en}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{s.name_np}</div>
                <div style={{ fontSize: '11px', color: '#DC143C', marginTop: '6px', fontWeight: 600 }}>From Rs {s.base_price}/hr</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ padding: '60px 5%', background: '#f9f9f9' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '6px' }}>
          How It Works / कसरी काम गर्छ
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '36px' }}>3 simple steps to get your task done</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { n: 1, title: 'Post Your Task', np: 'काम पोस्ट गर्नुस्', desc: "Describe what you need done, where, and when. It's free and takes under 2 minutes." },
            { n: 2, title: 'Get Matched', np: 'साथी भेट्नुस्', desc: 'Receive offers from nearby verified taskers. Compare profiles, ratings, and prices.' },
            { n: 3, title: 'Task Done!', np: 'काम सम्पन्न!', desc: 'Your tasker arrives, completes the job, and you pay securely through KaamSathi.' }
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '28px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8' }}>
              <div style={{
                width: '44px', height: '44px', background: '#003893', color: '#fff',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, margin: '0 auto 16px'
              }}>{item.n}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h3>
              <div style={{ fontSize: '12px', color: '#DC143C', fontWeight: 600, marginBottom: '8px' }}>{item.np}</div>
              <p style={{ fontSize: '13px', color: '#666' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED TASKERS ===== */}
      <section id="taskers" style={{ padding: '60px 5%' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '36px' }}>
          Top Rated Taskers / शीर्ष साथीहरू
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '18px' }}>
          {[
            { name: 'Ramesh Adhikari', nep: 'रा', city: 'Kathmandu', skills: ['Plumbing','Electrical'], rating: 5.0, tasks: 134, price: 800, bg: '#DC143C', online: true },
            { name: 'Sunita Tamang', nep: 'सु', city: 'Lalitpur', skills: ['Cleaning','Cooking'], rating: 4.9, tasks: 87, price: 600, bg: '#1a7a4a', online: true },
            { name: 'Bikash Shrestha', nep: 'बि', city: 'Pokhara', skills: ['Moving','Painting'], rating: 4.8, tasks: 210, price: 700, bg: '#003893', online: false },
            { name: 'Priya Gurung', nep: 'प्र', city: 'Bhaktapur', skills: ['Tutoring','Tech Help'], rating: 4.9, tasks: 56, price: 900, bg: '#003893', online: true },
          ].map((t, i) => (
            <TaskerCard key={i} tasker={t} />
          ))}
        </div>
      </section>

      {/* ===== TRUST ===== */}
      <section style={{ padding: '60px 5%', background: '#f9f9f9' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', marginBottom: '36px' }}>
          Why KaamSathi? / किन काम साथी?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '18px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '✅', title: 'Verified Taskers / प्रमाणित', desc: 'Every tasker undergoes background checks and ID verification before joining.' },
            { icon: '💰', title: 'Secure Payments / सुरक्षित भुक्तानी', desc: 'Pay via eSewa, Khalti, or bank transfer. Funds held safely until task is complete.' },
            { icon: '⭐', title: 'Real Reviews / वास्तविक समीक्षा', desc: 'Honest ratings from real customers across Nepal. No fake reviews, ever.' },
            { icon: '🛡️', title: 'Task Guarantee / ग्यारेन्टी', desc: "Not satisfied? We'll send another tasker or give you a full refund." }
          ].map((f, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h4>
              <p style={{ fontSize: '13px', color: '#666' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background: '#DC143C', color: '#fff', padding: '70px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
          Ready to Get Started? / सुरु गर्न तयार हुनुहुन्छ?
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.85, marginBottom: '28px' }}>
          Join 15,000+ Nepali households who trust KaamSathi for their everyday tasks.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/browse')}
            style={{ background: '#fff', color: '#DC143C', border: 'none', padding: '13px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
          >
            🔍 Post a Task — काम पोस्ट गर्नुस्
          </button>
          <button
            onClick={() => router.push('/auth')}
            style={{ background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,.6)', padding: '13px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
          >
            💼 Become a Tasker — साथी बन्नुस्
          </button>
        </div>
      </section>

    </main>
  )
}
