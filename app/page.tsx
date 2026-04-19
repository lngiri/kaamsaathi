'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Service = {
  id: string
  name_en: string
  name_np: string
  icon: string
  base_price: number
  category: string
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <main className="min-h-screen bg-white font-sans text-gray-800">
      {/* 🔹 NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">
            <span className="text-emerald-600">KaamSathi</span>
            <span className="text-gray-400 mx-2">|</span>
            <span className="text-emerald-700 text-xl">काम साथी</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition">How it Works / कसरी काम गर्छ</a>
            <a href="#services" className="text-gray-600 hover:text-emerald-600 transition">Services / सेवाहरू</a>
            <a href="#taskers" className="text-gray-600 hover:text-emerald-600 transition">Top Taskers</a>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">EN / नेप</button>
            <a href="#" className="text-gray-700 hover:text-emerald-600">Login / साइन इन</a>
            <a href="#" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold">Sign Up Free</a>
          </div>
        </div>
      </nav>

      {/* 🔹 HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-50 to-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            2,400+ verified taskers across Nepal | नेपालभर विश्वसनीय साथीहरू
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Get Any Task Done — <span className="text-emerald-600">Right Here in Nepal</span>
          </h1>
          <p className="text-xl sm:text-2xl text-emerald-700 font-medium mb-2">जुनसुकै काम, नेपालमै गराउनुस् — सजिलो, छिटो, भरपर्दो</p>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            From home repairs to tutoring, find trusted local taskers in Kathmandu, Pokhara, Chitwan & beyond.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-200 max-w-3xl mx-auto flex flex-col sm:flex-row gap-2">
            <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl flex-1">
              <span className="text-gray-400 mr-2 text-lg">📍</span>
              <select className="bg-transparent w-full outline-none text-gray-700 font-medium cursor-pointer">
                <option>Kathmandu</option><option>Lalitpur</option><option>Bhaktapur</option>
                <option>Pokhara</option><option>Chitwan</option><option>Butwal</option><option>Biratnagar</option>
              </select>
            </div>
            <div className="flex items-center px-4 py-3 border-l border-gray-200 flex-[2]">
              <input type="text" placeholder="Search services / खोज्नुस् (e.g. Plumbing, Cleaning)" className="w-full bg-transparent outline-none text-gray-700" />
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
              🔍 Find a Tasker
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[ 
              { val: '2,400+', label: 'Verified Taskers', np: 'प्रमाणित साथीहरू' }, 
              { val: '15,000+', label: 'Tasks Completed', np: 'सम्पन्न कामहरू' },
              { val: '4.8★', label: 'Average Rating', np: 'औसत मूल्यांकन' }, 
              { val: '30 min', label: 'Avg. Match Time', np: 'औसत मिलान समय' }
            ].map((stat, i) => (
              <div key={i} className="p-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{stat.val}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.np}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 SERVICES SECTION (DYNAMIC FROM SUPABASE) */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Popular Services <span className="text-emerald-600 text-2xl font-normal">| लोकप्रिय सेवाहरू</span></h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">Browse top service categories trusted by thousands of Nepali households</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12 text-gray-500 animate-pulse">Loading services from Supabase...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-red-500 bg-white rounded-xl border border-red-200">No active services found. Please check Supabase.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group hover:border-emerald-300">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">{service.name_en}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2">{service.name_np}</p>
                  <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 inline-block px-2 py-0.5 rounded">From Rs {service.base_price}/hr</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🔹 HOW IT WORKS */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works <span className="text-emerald-600 text-2xl font-normal">| कसरी काम गर्छ</span></h2>
          <p className="text-gray-600 mb-10">3 simple steps to get your task done</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[ 
              { step: 1, title: 'Post Your Task', np: 'काम पोस्ट गर्नुस्', desc: 'Describe what you need done, where, and when. It\'s free and takes under 2 minutes.' },
              { step: 2, title: 'Get Matched', np: 'साथी भेट्नुस्', desc: 'Receive offers from nearby verified taskers. Compare profiles, ratings, and prices.' },
              { step: 3, title: 'Task Done!', np: 'काम सम्पन्न!', desc: 'Your tasker arrives, completes the job, and you pay securely through KaamSathi.' }
            ].map((item, i) => (
              <div key={i} className="relative p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-emerald-600 font-medium mb-3 text-sm">{item.np}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 TOP TASKERS */}
      <section id="taskers" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Top Rated Taskers <span className="text-emerald-600 text-2xl font-normal">| शीर्ष साथीहरू</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[ 
              { name: 'Ramesh Adhikari', init: 'रा', city: 'Kathmandu', rating: '5.0', tasks: 134, skills: ['Plumbing', 'Electrical'], price: 800 },
              { name: 'Sunita Tamang', init: 'सु', city: 'Lalitpur', rating: '4.9', tasks: 87, skills: ['Cleaning', 'Cooking'], price: 600 },
              { name: 'Bikash Shrestha', init: 'बि', city: 'Pokhara', rating: '4.8', tasks: 210, skills: ['Moving', 'Painting'], price: 700 },
              { name: 'Priya Gurung', init: 'प्र', city: 'Bhaktapur', rating: '4.9', tasks: 56, skills: ['Tutoring', 'Tech Help'], price: 900 }
            ].map((t, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-emerald-200 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg">{t.init}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">📍 {t.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-amber-500 mb-2">★★★★★ <span className="text-gray-700 font-semibold">{t.rating}</span> <span className="text-gray-400">({t.tasks} tasks)</span></div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {t.skills.map(s => <span key={s} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">{s}</span>)}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="font-bold text-emerald-600">Rs {t.price}/hr</span>
                  <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-100 transition">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 WHY KAAMSATHI */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why KaamSathi? <span className="text-emerald-600 text-2xl font-normal">| किन काम साथी?</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[ 
              { icon: '✅', title: 'Verified Taskers', np: 'प्रमाणित', desc: 'Every tasker undergoes background checks, ID verification, and skill assessments before joining.' },
              { icon: '💰', title: 'Secure Payments', np: 'सुरक्षित भुक्तानी', desc: 'Pay via eSewa, Khalti, or bank transfer. Funds are held safely until your task is complete.' },
              { icon: '⭐', title: 'Real Reviews', np: 'वास्तविक समीक्षा', desc: 'Honest ratings from real customers across Nepal. No fake reviews, ever.' },
              { icon: '🛡️', title: 'Task Guarantee', np: 'ग्यारेन्टी', desc: 'Not satisfied? We\'ll send another tasker or give you a full refund. Your peace of mind first.' }
            ].map((f, i) => (
              <div key={i} className="p-5 border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition bg-gray-50/50">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg text-gray-900">{f.title}</h3>
                <p className="text-emerald-600 text-sm font-medium mb-2">{f.np}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to Get Started? <span className="text-emerald-200 text-2xl font-normal">| सुरु गर्न तयार हुनुहुन्छ?</span></h2>
          <p className="text-emerald-100 mb-8 text-lg">Join 15,000+ Nepali households who trust KaamSathi for their everyday tasks.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">🔍 Post a Task</button>
            <button className="px-8 py-3 bg-emerald-700 text-white font-bold rounded-xl border-2 border-white/30 hover:bg-emerald-800 transition">💼 Become a Tasker</button>
          </div>
        </div>
      </section>

      {/* 🔹 FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-white mb-4">KaamSathi <span className="text-emerald-400">| काम साथी</span></div>
            <p className="text-sm text-gray-400 leading-relaxed">Nepal's trusted platform connecting people with skilled local taskers. Made in Nepal 🇳🇵 by Nepali, for Nepali.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition">Plumbing / प्लम्बिङ</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Cleaning / सफाई</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Electrical / विद्युत</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">All Services →</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition">About Us / हाम्रो बारे</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Careers / रोजगार</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-3">Contact</h4>
            <p className="text-sm mb-1">📧 hello@kaamsathi.com.np</p>
            <p className="text-sm mb-1">📞 +977-01-XXXXXXX</p>
            <p className="text-sm">🏢 Kathmandu, Nepal</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} KaamSathi Pvt. Ltd. — Made with ❤ in Nepal 🇳🇵 | काम साथी — नेपालको आफ्नो प्लेटफर्म
        </div>
      </footer>
    </main>
  )
}