// app/browse/page.tsx
'use client'
import { useState } from 'react'

// Mock tasker data (will connect to Supabase later)
const MOCK_TASKERS = [
  { id: 1, name: 'Ramesh Adhikari', init: 'रा', city: 'Kathmandu', skills: ['Plumbing', 'Electrical'], rating: 5.0, tasks: 134, price: 800, distance: 1.2, online: true, gender: 'male', available: 'now' },
  { id: 2, name: 'Sunita Tamang', init: 'सु', city: 'Lalitpur', skills: ['Cleaning', 'Cooking'], rating: 4.9, tasks: 87, price: 600, distance: 2.4, online: true, gender: 'female', available: 'now' },
  { id: 3, name: 'Bikash Shrestha', init: 'बि', city: 'Pokhara', skills: ['Moving', 'Painting'], rating: 4.8, tasks: 210, price: 700, distance: 5.1, online: false, gender: 'male', available: 'today' },
  { id: 4, name: 'Priya Gurung', init: 'प्र', city: 'Bhaktapur', skills: ['Tutoring', 'Tech Help'], rating: 4.9, tasks: 56, price: 900, distance: 3.7, online: true, gender: 'female', available: 'advance' },
  { id: 5, name: 'Anil Maharjan', init: 'अ', city: 'Kathmandu', skills: ['Gardening', 'Cleaning'], rating: 4.7, tasks: 92, price: 550, distance: 0.8, online: true, gender: 'male', available: 'now' },
  { id: 6, name: 'Rita Basnet', init: 'रि', city: 'Chitwan', skills: ['Cooking', 'Caretaking'], rating: 4.8, tasks: 45, price: 650, distance: 8.2, online: false, gender: 'female', available: 'today' },
]

const CITIES = ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan', 'Butwal', 'Biratnagar']
const SERVICES = ['Plumbing', 'Cleaning', 'Electrical', 'Tutoring', 'Moving', 'Cooking', 'Tech Help', 'Gardening', 'Caretaking', 'Pet Care', 'Painting', 'Driver']

export default function BrowsePage() {
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid')
  const [city, setCity] = useState('Kathmandu')
  const [search, setSearch] = useState('')
  const [priceRange, setPriceRange] = useState([200, 2000])
  const [minRating, setMinRating] = useState(0)
  const [distance, setDistance] = useState(10)
  const [available, setAvailable] = useState<string[]>([])
  const [gender, setGender] = useState('any')
  const [selectedService, setSelectedService] = useState('')

  // Filter logic
  const filteredTaskers = MOCK_TASKERS.filter(t => {
    const matchesCity = t.city.toLowerCase().includes(city.toLowerCase())
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                          t.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
    const matchesPrice = t.price >= priceRange[0] && t.price <= priceRange[1]
    const matchesRating = t.rating >= minRating
    const matchesDistance = t.distance <= distance
    const matchesAvailability = available.length === 0 || available.includes(t.available)
    const matchesGender = gender === 'any' || t.gender === gender
    const matchesService = selectedService === '' || t.skills.includes(selectedService)
    
    return matchesCity && matchesSearch && matchesPrice && matchesRating && 
           matchesDistance && matchesAvailability && matchesGender && matchesService
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-emerald-700">KaamSathi <span className="text-emerald-500 text-lg">| काम साथी</span></a>
          <div className="flex gap-4">
            <a href="/browse" className="text-emerald-700 font-medium">Browse</a>
            <button className="px-4 py-2 text-gray-600 hover:text-emerald-600">Login</button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Header & Search */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Taskers Near You <span className="text-emerald-600 text-2xl font-normal block sm:inline sm:ml-2">/ नजिकका साथीहरू खोज्नुस्</span>
          </h1>
          <p className="text-gray-600 mb-6">Browse 2,400+ verified taskers across Nepal</p>
          
          <div className="flex flex-col md:flex-row gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div className="flex-1 flex items-center gap-2 px-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-400">📍</span>
              <select value={city} onChange={e => setCity(e.target.value)} className="w-full py-2 outline-none bg-transparent">
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 flex items-center gap-2 px-3 bg-white rounded-lg border border-gray-200">
              <span className="text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="Search by name or service / खोज्नुस्..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full py-2 outline-none bg-transparent"
              />
            </div>
            <button className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition">
              Search
            </button>
          </div>

          {/* Service Pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              onClick={() => setSelectedService('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${selectedService === '' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border`}
            >
              All / सबै
            </button>
            {SERVICES.slice(0, 8).map(s => (
              <button 
                key={s}
                onClick={() => setSelectedService(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition ${selectedService === s ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'} border`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-4 gap-6">
        
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Filters / फिल्टर</h3>
              <button onClick={() => {setPriceRange([200,2000]); setMinRating(0); setDistance(10); setAvailable([]); setGender('any'); setSelectedService('')}} className="text-xs text-emerald-600 hover:underline">Clear All</button>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Availability / उपलब्धता</h4>
              {[{id:'now', label:'Available Now', count:18}, {id:'today', label:'Available Today', count:24}, {id:'advance', label:'Book in Advance', count:42}].map(opt => (
                <label key={opt.id} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" checked={available.includes(opt.id)} onChange={e => {
                    const next = e.target.checked ? [...available, opt.id] : available.filter(a => a !== opt.id)
                    setAvailable(next)
                  }} className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-gray-600 flex-1">{opt.label}</span>
                  <span className="text-xs text-gray-400">{opt.count}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Price Range (Rs/hr)</h4>
              <div className="flex gap-2 items-center">
                <input type="number" value={priceRange[0]} onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                <span className="text-gray-400">—</span>
                <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Up to Rs {priceRange[1]}/hr</p>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Minimum Rating</h4>
              <div className="flex flex-wrap gap-2">
                {[0, 4, 4.5, 5].map(r => (
                  <button key={r} onClick={() => setMinRating(r)} className={`px-2 py-1 text-xs rounded border ${minRating === r ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                    {r === 0 ? 'All' : `${r}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Distance / दूरी</h4>
              <input type="range" min="1" max="30" value={distance} onChange={e => setDistance(Number(e.target.value))} className="w-full accent-emerald-600" />
              <p className="text-xs text-gray-500 mt-1">Within {distance} km</p>
            </div>

            {/* Gender */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Gender / लिङ्ग</h4>
              <div className="flex gap-2">
                {[{id:'any', label:'Any'}, {id:'male', label:'Male / पुरुष'}, {id:'female', label:'Female / महिला'}].map(g => (
                  <button key={g.id} onClick={() => setGender(g.id)} className={`flex-1 px-2 py-1 text-xs rounded border ${gender === g.id ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Button */}
          <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm">
            📍 Use My Location for Nearby Taskers
          </button>
        </aside>

        {/* Tasker Results */}
        <section className="lg:col-span-3">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <p className="text-gray-600 text-sm">{filteredTaskers.length} taskers found near {city}</p>
            <div className="flex items-center gap-3">
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                <option>Sort: Nearest First</option>
                <option>Sort: Highest Rated</option>
                <option>Sort: Price Low → High</option>
              </select>
              <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setView('grid')} className={`p-2 ${view==='grid' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>⊞</button>
                <button onClick={() => setView('list')} className={`p-2 ${view==='list' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>☰</button>
                <button onClick={() => setView('map')} className={`p-2 ${view==='map' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>🗺️</button>
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredTaskers.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center">
              <p className="text-xl text-gray-500">No taskers match your filters</p>
              <button onClick={() => {setPriceRange([200,2000]); setMinRating(0); setDistance(30); setAvailable([]); setGender('any')}} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Reset Filters</button>
            </div>
          ) : view === 'map' ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center min-h-[400px] flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-800">Map View Coming Soon</h3>
              <p className="text-gray-500 text-sm mt-2">Google Maps API integration will show live tasker pins here.</p>
            </div>
          ) : (
            <div className={view === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-4'}>
              {filteredTaskers.map(t => (
                <div key={t.id} className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden ${view === 'list' ? 'flex flex-col sm:flex-row' : ''}`}>
                  <div className={`p-5 ${view === 'list' ? 'sm:w-48 flex-shrink-0 bg-gray-50 flex items-center justify-center' : ''}`}>
                    <div className={`w-16 h-16 ${t.online ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'} rounded-full flex items-center justify-center font-bold text-xl relative mx-auto ${view === 'list' ? '' : ''}`}>
                      {t.init}
                      {t.online && <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>}
                    </div>
                  </div>
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{t.name}</h3>
                        <p className="text-sm text-gray-500">📍 {t.city} · {t.distance} km</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">Rs {t.price}/hr</p>
                        <p className="text-xs text-gray-400">Starting rate</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500 text-sm">★ {t.rating}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-xs text-gray-500">{t.tasks} tasks</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {t.skills.map(s => <span key={s} className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">{s}</span>)}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition text-sm">
                        Book Now
                      </button>
                      <button className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}