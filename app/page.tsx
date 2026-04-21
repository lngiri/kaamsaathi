'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Service = {
  id: string
  name_en: string
  name_np: string
  icon: string
  base_price: number
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('Kathmandu')
  const [lang, setLang] = useState<'en' | 'np'>('en')
  const router = useRouter()

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
          .order('name_en')
        if (error) throw error
        setServices(data || [])
      } catch (err) {
        console.error('Failed to load services:', err)
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

  const t = {
    hero1: lang === 'en' ? 'Get Any Task Done — Right Here in Nepal' : 'जुनसुकै काम, नेपालमै गराउनुस्',
    hero2: lang === 'en' ? 'जुनसुकै काम, नेपालमै गराउनुस् — सजिलो, छिटो, भरपर्दो' : 'Get any task done — easy, fast, reliable',
    searchPlaceholder: lang === 'en' ? 'What do you need done? (e.g. Plumber, Cleaner)' : 'के काम चाहियो? (जस्तै: प्लम्बर, सफाई)',
    findBtn: lang === 'en' ? '🔍 Find a Tasker' : '🔍 साथी खोज्नुस्',
    becomeBtn: lang === 'en' ? '💼 Become a Tasker' : '💼 साथी बन्नुस्',
    servicesTitle: lang === 'en' ? 'Popular Services' : 'लोकप्रिय सेवाहरू',
    howTitle: lang === 'en' ? 'How It Works' : 'कसरी काम गर्छ',
    taskersTitle: lang === 'en' ? 'Top Rated Taskers' : 'शीर्ष साथीहरू',
    whyTitle: lang === 'en' ? 'Why KaamSathi?' : 'किन काम साथी?',
    ctaTitle: lang === 'en' ? 'Ready to Get Started?' : 'सुरु गर्न तयार हुनुहुन्छ?',
    bookNow: lang === 'en' ? 'Book Now' : 'बुक गर्नुस्',
    login: lang === 'en' ? 'Login' : 'साइन इन',
    signUp: lang === 'en' ? 'Sign Up Free' : 'नि:शुल्क दर्ता',
  }

  return (
    <main style={{ fontFamily: "'Segoe UI', sans-serif", color: '#1a1a1a', background: '#fff', minHeight: '100vh' }}>

      {/* ===== NAVBAR ===== */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: '68px', borderBottom: '1px solid #e8e8e8',
        position: 'sticky', top: 0, background: '#fff', zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', background: '#C0392B', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '18px'
          }}>क</div>
          <div>
            <div style={{ fontSize: '19px', fontWeight: 700 }}>KaamSathi</div>
            <div style={{ fontSize: '12px', color: '#666' }}>काम साथी</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '14px' }}>
          <a href="#how-it-works" style={{ color: '#666', textDecoration: 'none' }}>How it Works</a>
          <a href="#services" style={{ color: '#666', textDecoration: 'none' }}>Services / सेवाहरू</a>
          <a href="#taskers" style={{ color: '#666', textDecoration: 'none' }}>Top Taskers</a>

          {/* Language Toggle */}
          <div
            style={{ display: 'flex', border: '1px solid #e8e8e8', borderRadius: '20px', overflow: 'hidden', fontSize: '12px', cursor: 'pointer' }}
            onClick={() => setLang(lang === 'en' ? 'np' : 'en')}
          >
            <span style={{ padding: '4px 12px', background: lang === 'en' ? '#C0392B' : 'transparent', color: lang === 'en' ? '#fff' : '#666' }}>EN</span>
            <span style={{ padding: '4px 12px', background: lang === 'np' ? '#C0392B' : 'transparent', color: lang === 'np' ? '#fff' : '#666' }}>नेप</span>
          </div>

          <button
            onClick={() => router.push('/auth?type=login')}
            style={{ background: 'transparent', border: '1.5px solid #e8e8e8', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            {t.login}
          </button>
          <button
            onClick={() => router.push('/auth?type=customer')}
            style={{ background: '#C0392B', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
          >
            {t.signUp}
          </button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header style={{ background: 'linear-gradient(135deg,#FFF5F5 0%,#FFF0F0 40%,#FFF8F0 100%)', padding: '70px 5% 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#fff', border: '1px solid #e8e8e8', borderRadius: '20px',
          padding: '5px 14px', fontSize: '12px', color: '#666', marginBottom: '24px'
        }}>
          <span style={{ color: '#16a34a', fontSize: '11px' }}>●</span>
          2,400+ verified taskers across Nepal &nbsp;|&nbsp; नेपालभर विश्वसनीय साथीहरू
        </div>

        <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '10px' }}>
          Get Any Task Done — <span style={{ color: '#C0392B' }}>Right Here in Nepal</span>
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
          overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
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
            style={{ background: '#C0392B', color: '#fff', border: 'none', padding: '14px 24px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            Search / खोज्नुस्
          </button>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
          <button
            onClick={() => router.push('/browse')}
            style={{ background: '#C0392B', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            🔍 Find a Tasker
          </button>
          <button
            onClick={() => router.push('/auth')}
            style={{ background: '#fff', color: '#1a1a1a', border: '1.5px solid #e8e8e8', padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
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
              <strong style={{ display: 'block', fontSize: '22px', fontWeight: 700 }}>{s.val}</strong>
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
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#C0392B')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8e8')}
              >
                <div style={{ fontSize: '30px', marginBottom: '10px' }}>{s.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{s.name_en}</div>
                <div style={{ fontSize: '11px', color: '#666' }}>{s.name_np}</div>
                <div style={{ fontSize: '11px', color: '#C0392B', marginTop: '6px', fontWeight: 600 }}>From Rs {s.base_price}/hr</div>
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
                width: '44px', height: '44px', background: '#C0392B', color: '#fff',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 700, margin: '0 auto 16px'
              }}>{item.n}</div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>{item.title}</h3>
              <div style={{ fontSize: '12px', color: '#C0392B', fontWeight: 600, marginBottom: '8px' }}>{item.np}</div>
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
            { name: 'Ramesh Adhikari', nep: 'रा', city: 'Kathmandu', skills: ['Plumbing','Electrical'], rating: 5.0, tasks: 134, price: 800, bg: '#C0392B', online: true },
            { name: 'Sunita Tamang', nep: 'सु', city: 'Lalitpur', skills: ['Cleaning','Cooking'], rating: 4.9, tasks: 87, price: 600, bg: '#1a7a4a', online: true },
            { name: 'Bikash Shrestha', nep: 'बि', city: 'Pokhara', skills: ['Moving','Painting'], rating: 4.8, tasks: 210, price: 700, bg: '#2563EB', online: false },
            { name: 'Priya Gurung', nep: 'प्र', city: 'Bhaktapur', skills: ['Tutoring','Tech Help'], rating: 4.9, tasks: 56, price: 900, bg: '#7c3aed', online: true },
          ].map((t, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #e8e8e8', borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%', background: t.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 700, color: '#fff', flexShrink: 0, position: 'relative'
                }}>
                  {t.nep}
                  <div style={{
                    position: 'absolute', bottom: '2px', right: '2px',
                    width: '12px', height: '12px', borderRadius: '50%',
                    background: t.online ? '#16a34a' : '#ccc', border: '2px solid #fff'
                  }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{t.name}</h4>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>📍 {t.city}</div>
                  <div style={{ fontSize: '12px', color: '#f59e0b' }}>
                    ★★★★★ <strong style={{ color: '#1a1a1a' }}>{t.rating}</strong>
                    <span style={{ color: '#666' }}> ({t.tasks} reviews)</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 18px 10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {t.skills.map(s => (
                  <span key={s} style={{ background: '#fdecea', color: '#C0392B', fontSize: '11px', padding: '3px 9px', borderRadius: '10px', fontWeight: 500 }}>{s}</span>
                ))}
              </div>
              <div style={{ padding: '12px 18px', borderTop: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a' }}>Rs {t.price}/hr</span>
                <button
                  onClick={() => router.push('/browse')}
                  style={{ background: '#C0392B', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Book Now
                </button>
              </div>
            </div>
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
      <section style={{ background: '#C0392B', color: '#fff', padding: '70px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
          Ready to Get Started? / सुरु गर्न तयार हुनुहुन्छ?
        </h2>
        <p style={{ fontSize: '16px', opacity: 0.85, marginBottom: '28px' }}>
          Join 15,000+ Nepali households who trust KaamSathi for their everyday tasks.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/browse')}
            style={{ background: '#fff', color: '#C0392B', border: 'none', padding: '13px 28px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
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

      {/* ===== FOOTER ===== */}
      <footer style={{ background: '#1a1a1a', color: '#ccc', padding: '48px 5% 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(3,1fr)', gap: '32px', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#C0392B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>क</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>KaamSathi | काम साथी</div>
            </div>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.7 }}>
              Nepal&apos;s trusted platform connecting people with skilled local taskers. Made in Nepal 🇳🇵 by Nepali, for Nepali.
            </p>
            <p style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
              📧 hello@kaamsathi.com.np<br />
              📞 +977-01-XXXXXXX<br />
              🏢 Kathmandu, Nepal
            </p>
          </div>
          <div>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Services</h5>
            {['Plumbing / प्लम्बिङ','Cleaning / सफाई','Electrical / विद्युत','Moving / सार्ने','All Services →'].map(s => (
              <button key={s} onClick={() => router.push('/browse')} style={{ display: 'block', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', textAlign: 'left', padding: 0 }}>{s}</button>
            ))}
          </div>
          <div>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Company</h5>
            {['About Us / हाम्रो बारे','How it Works','Careers / रोजगार','Blog','Press'].map(s => (
              <button key={s} onClick={() => router.push('/auth')} style={{ display: 'block', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', textAlign: 'left', padding: 0 }}>{s}</button>
            ))}
          </div>
          <div>
            <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '.5px' }}>Support</h5>
            {['Help Center','Safety / सुरक्षा','Terms of Service','Privacy Policy','Contact Us'].map(s => (
              <button key={s} onClick={() => router.push('/auth')} style={{ display: 'block', fontSize: '13px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '8px', textAlign: 'left', padding: 0 }}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: '#666' }}>
          <span>© {new Date().getFullYear()} KaamSathi Pvt. Ltd. — Made with <span style={{ color: '#C0392B' }}>❤</span> in Nepal 🇳🇵</span>
          <span>काम साथी — नेपालको आफ्नो प्लेटफर्म</span>
        </div>
      </footer>

    </main>
  )
}