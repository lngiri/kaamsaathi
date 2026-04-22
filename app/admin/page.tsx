    'use client'
import { useState } from 'react'

const THEMES = {
  red:    { primary: '#C0392B', secondary: '#1a1a2e', name: 'Red & Dark (Default)' },
  blue:   { primary: '#1e3a5f', secondary: '#0f2744', name: 'Dark Blue & Navy' },
  orange: { primary: '#d4500a', secondary: '#1a1a2e', name: 'Deep Orange & Dark' },
  green:  { primary: '#166534', secondary: '#14532d', name: 'Forest Green' },
  purple: { primary: '#6b21a8', secondary: '#1e1b4b', name: 'Royal Purple' },
}
type ThemeKey = keyof typeof THEMES

const INIT_SERVICES = [
  { id:1, icon:'🔧', name_en:'Plumbing', name_np:'प्लम्बिङ', base:800, min:400, max:2000, active:true, image:'' },
  { id:2, icon:'🧹', name_en:'Cleaning', name_np:'सफाई', base:600, min:300, max:1500, active:true, image:'' },
  { id:3, icon:'⚡', name_en:'Electrical', name_np:'विद्युत', base:900, min:500, max:2500, active:true, image:'' },
  { id:4, icon:'📦', name_en:'Moving', name_np:'सार्ने', base:1200, min:800, max:3000, active:true, image:'' },
  { id:5, icon:'📚', name_en:'Tutoring', name_np:'ट्युसन', base:700, min:400, max:1800, active:true, image:'' },
  { id:6, icon:'🍳', name_en:'Cooking', name_np:'खाना', base:650, min:350, max:1500, active:false, image:'' },
]

const INIT_REVIEWS = [
  { id:1, customer:'Aarav K.', tasker:'Ramesh A.', rating:5, comment:'Excellent work! Very professional.', date:'Apr 19', status:'published' },
  { id:2, customer:'Nisha T.', tasker:'Sunita T.', rating:4, comment:'Good service, came on time.', date:'Apr 18', status:'published' },
  { id:3, customer:'Rohan S.', tasker:'Bikash S.', rating:1, comment:'This tasker is fake and scammed me!!!', date:'Apr 17', status:'flagged' },
  { id:4, customer:'Priya G.', tasker:'Anil M.', rating:2, comment:'Very bad attitude, would not recommend at all.', date:'Apr 16', status:'published' },
]

const INIT_TASKERS = [
  { id:1, name:'Ramesh Adhikari', city:'Kathmandu', skills:'Plumbing, Electrical', rating:5.0, tasks:134, status:'active' },
  { id:2, name:'Sunita Tamang', city:'Lalitpur', skills:'Cleaning, Cooking', rating:4.9, tasks:87, status:'active' },
  { id:3, name:'Bikram Rai', city:'Kathmandu', skills:'Electrical', rating:0, tasks:0, status:'pending' },
  { id:4, name:'Sita Lama', city:'Chitwan', skills:'Cleaning', rating:0, tasks:0, status:'pending' },
]

export default function AdminPage() {
  const [activePage, setActivePage] = useState('overview')
  const [activeTheme, setActiveTheme] = useState<ThemeKey>('red')
  const [services, setServices] = useState(INIT_SERVICES)
  const [reviews, setReviews] = useState(INIT_REVIEWS)
  const [taskers, setTaskers] = useState(INIT_TASKERS)
  const [editSvc, setEditSvc] = useState<typeof INIT_SERVICES[0] | null>(null)
  const [toast, setToast] = useState('')
  const [newSvc, setNewSvc] = useState({ icon:'', name_en:'', name_np:'', base:500, min:200, max:2000 })
  const [showAddSvc, setShowAddSvc] = useState(false)

  const t = THEMES[activeTheme]

  const notify = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const sidebarItems = [
    { id:'overview', icon:'📊', label:'Overview' },
    { id:'taskers', icon:'👷', label:'Taskers' },
    { id:'services', icon:'🛠️', label:'Services & Pricing' },
    { id:'reviews', icon:'⭐', label:'Reviews & Reports' },
    { id:'bookings', icon:'📋', label:'Bookings' },
    { id:'payments', icon:'💰', label:'Payments' },
    { id:'theme', icon:'🎨', label:'Theme & Branding' },
    { id:'settings', icon:'⚙️', label:'Settings' },
  ]

  const statCards = [
    { label:'Total Taskers', val:'2,418', change:'↑ 12%', color: t.primary },
    { label:'Active Bookings', val:'184', change:'↑ 8% today', color:'#2563eb' },
    { label:'Revenue (Rs)', val:'4.2L', change:'↑ 22%', color:'#16a34a' },
    { label:'Pending Reviews', val:'3', change:'⚠ Flagged', color:'#d97706' },
  ]

  const inp: React.CSSProperties = { border:'1.5px solid #e8e8e8', borderRadius:'8px', padding:'9px 12px', fontSize:'13px', outline:'none', width:'100%' }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Segoe UI',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', bottom:'20px', right:'20px', background:'#1a1a1a', color:'#fff', padding:'12px 18px', borderRadius:'10px', fontSize:'13px', zIndex:999 }}>
          {toast}
        </div>
      )}

      {/* Edit Service Modal */}
      {editSvc && (
        <div onClick={() => setEditSvc(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#fff', borderRadius:'14px', padding:'24px', width:'460px', maxWidth:'calc(100vw - 40px)', maxHeight:'calc(100vh - 40px)', overflow:'auto' }}>
            <h3 style={{ fontSize:'16px', fontWeight:700, marginBottom:'16px' }}>Edit Service: {editSvc.icon} {editSvc.name_en}</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>ICON</label><input value={editSvc.icon} onChange={e => setEditSvc({...editSvc, icon:e.target.value})} style={inp} /></div>
              <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>NAME (EN)</label><input value={editSvc.name_en} onChange={e => setEditSvc({...editSvc, name_en:e.target.value})} style={inp} /></div>
              <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>NAME (नेपाली)</label><input value={editSvc.name_np} onChange={e => setEditSvc({...editSvc, name_np:e.target.value})} style={inp} /></div>
              <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>BASE PRICE (Rs/hr)</label><input type="number" value={editSvc.base} onChange={e => setEditSvc({...editSvc, base:Number(e.target.value)})} style={inp} /></div>
              <div><label style={{ fontSize:'11px', fontWeight:700, color:'#66', display:'block', marginBottom:'4px' }}>MIN PRICE (Rs/hr)</label><input type="number" value={editSvc.min} onChange={e => setEditSvc({...editSvc, min:Number(e.target.value)})} style={inp} /></div>
              <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>MAX PRICE (Rs/hr)</label><input type="number" value={editSvc.max} onChange={e => setEditSvc({...editSvc, max:Number(e.target.value)})} style={inp} /></div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>CATEGORY IMAGE URL</label>
                <input placeholder="https://... or upload from storage" value={editSvc.image} onChange={e => setEditSvc({...editSvc, image:e.target.value})} style={inp} />
                <p style={{ fontSize:'11px', color:'#999', marginTop:'3px' }}>Upload to Supabase Storage → paste URL here</p>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', fontSize:'13px' }}>
                  <input type="checkbox" checked={editSvc.active} onChange={e => setEditSvc({...editSvc, active:e.target.checked})} style={{ accentColor:t.primary, width:'16px', height:'16px' }} />
                  Service is Active / सेवा सक्रिय छ
                </label>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'18px' }}>
              <button onClick={() => setEditSvc(null)} style={{ flex:1, padding:'10px', border:'1.5px solid #e8e8e8', borderRadius:'8px', background:'#fff', cursor:'pointer', fontWeight:600 }}>Cancel</button>
              <button onClick={() => {
                setServices(services.map(s => s.id === editSvc.id ? editSvc : s))
                setEditSvc(null)
                notify('✓ Service updated successfully!')
              }} style={{ flex:2, padding:'10px', background:t.primary, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside style={{ width:'230px', background:'#1a1a2e', color:'#fff', display:'flex', flexDirection:'column', flexShrink:0, overflowY:'auto' }}>
        <div style={{ padding:'20px 18px 14px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize:'16px', fontWeight:700 }}>⚡ KaamSathi</div>
          <div style={{ fontSize:'11px', color:'#888', marginTop:'2px' }}>Admin Dashboard</div>
          <div style={{ marginTop:'8px', background:t.primary, color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 8px', borderRadius:'10px', display:'inline-block' }}>ADMIN</div>
        </div>
        <nav style={{ padding:'14px 0', flex:1 }}>
          {sidebarItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display:'flex', alignItems:'center', gap:'10px', padding:'10px 18px',
                cursor:'pointer', fontSize:'13px', transition:'all .15s',
                background: activePage === item.id ? `${t.primary}22` : 'transparent',
                color: activePage === item.id ? '#fff' : '#aaa',
                borderLeft: activePage === item.id ? `3px solid ${t.primary}` : '3px solid transparent'
              }}
            >
              <span style={{ fontSize:'16px', width:'20px', textAlign:'center' }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'reviews' && reviews.filter(r => r.status === 'flagged').length > 0 && (
                <span style={{ marginLeft:'auto', background:'#dc2626', color:'#fff', fontSize:'10px', padding:'1px 6px', borderRadius:'8px' }}>
                  {reviews.filter(r => r.status === 'flagged').length}
                </span>
              )}
              {item.id === 'taskers' && taskers.filter(t => t.status === 'pending').length > 0 && (
                <span style={{ marginLeft:'auto', background:t.primary, color:'#fff', fontSize:'10px', padding:'1px 6px', borderRadius:'8px' }}>
                  {taskers.filter(t => t.status === 'pending').length}
                </span>
              )}
            </div>
          ))}
        </nav>
        <div style={{ padding:'14px 18px', borderTop:'1px solid rgba(255,255,255,0.08)', fontSize:'12px', color:'#666' }}>
          v2.0 · KaamSathi Admin
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Topbar */}
        <div style={{ background:'#fff', borderBottom:'1px solid #e8e8e8', padding:'0 24px', height:'58px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <h1 style={{ fontSize:'16px', fontWeight:700 }}>{sidebarItems.find(s => s.id === activePage)?.icon} {sidebarItems.find(s => s.id === activePage)?.label}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <input placeholder="Search..." style={{ border:'1px solid #e8e8e8', borderRadius:'8px', padding:'7px 12px', fontSize:'13px', outline:'none', width:'180px' }} />
            <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:t.primary, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>A</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px 24px' }}>

          {/* OVERVIEW */}
          {activePage === 'overview' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'22px' }}>
                {statCards.map((s,i) => (
                  <div key={i} style={{ background:'#fff', borderRadius:'10px', padding:'18px 20px', border:'1px solid #e8e8e8' }}>
                    <div style={{ fontSize:'12px', color:'#666', marginBottom:'6px' }}>{s.label}</div>
                    <div style={{ fontSize:'26px', fontWeight:700, color:s.color }}>{s.val}</div>
                    <div style={{ fontSize:'12px', marginTop:'4px', color:'#16a34a' }}>{s.change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8', padding:'20px' }}>
                <h3 style={{ fontSize:'14px', fontWeight:700, marginBottom:'16px' }}>Quick Actions</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                  {[
                    { label:'Review Pending Taskers', icon:'👷', page:'taskers' },
                    { label:'Manage Reviews', icon:'⭐', page:'reviews' },
                    { label:'Edit Services & Pricing', icon:'🛠️', page:'services' },
                    { label:'View Payments', icon:'💰', page:'payments' },
                    { label:'Change Theme', icon:'🎨', page:'theme' },
                    { label:'Platform Settings', icon:'⚙️', page:'settings' },
                  ].map((a,i) => (
                    <button key={i} onClick={() => setActivePage(a.page)} style={{ background:'#f4f6fb', border:'1px solid #e8e8e8', borderRadius:'9px', padding:'14px', cursor:'pointer', fontSize:'13px', fontWeight:600, textAlign:'left', display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ fontSize:'20px' }}>{a.icon}</span>{a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TASKERS */}
          {activePage === 'taskers' && (
            <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <h3 style={{ fontSize:'14px', fontWeight:700 }}>All Taskers</h3>
                <button onClick={() => notify('Invite link copied!')} style={{ background:t.primary, color:'#fff', border:'none', borderRadius:'8px', padding:'8px 14px', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>+ Invite Tasker</button>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f9f9f9' }}>
                    {['Tasker','City','Skills','Rating','Tasks','Status','Actions'].map(h => (
                      <th key={h} style={{ fontSize:'11px', color:'#666', textAlign:'left', padding:'10px 16px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taskers.map((t,i) => (
                    <tr key={i} style={{ borderTop:'1px solid #e8e8e8' }}>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600 }}>{t.name}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', color:'#666' }}>{t.city}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'#666' }}>{t.skills}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px' }}>{t.rating > 0 ? `⭐ ${t.rating}` : '—'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px' }}>{t.tasks}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background: t.status==='active' ? '#dcfce7' : t.status==='pending' ? '#fef3c7' : '#fee2e2', color: t.status==='active' ? '#16a34a' : t.status==='pending' ? '#d97706' : '#dc2626', fontSize:'11px', padding:'3px 9px', borderRadius:'10px', fontWeight:600 }}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:'6px' }}>
                          {t.status === 'pending' ? (
                            <>
                              <button onClick={() => { setTaskers(taskers.map((tk,j) => j===i ? {...tk,status:'active'} : tk)); notify('✓ Tasker approved! SMS sent.') }} style={{ background:'#dcfce7', color:'#16a34a', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Approve</button>
                              <button onClick={() => { setTaskers(taskers.map((tk,j) => j===i ? {...tk,status:'rejected'} : tk)); notify('Tasker rejected.') }} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Reject</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => notify('Opening tasker profile...')} style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>View</button>
                              <button onClick={() => { setTaskers(taskers.map((tk,j) => j===i ? {...tk,status:'suspended'} : tk)); notify('Tasker suspended.') }} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Suspend</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SERVICES */}
          {activePage === 'services' && (
            <div>
              <div style={{ background:'#fff3cd', border:'1px solid #ffd54f', borderRadius:'10px', padding:'14px 18px', marginBottom:'18px', fontSize:'13px', color:'#6d4c00' }}>
                <strong>💡 Price Policy:</strong> Set minimum and maximum prices per category. Taskers cannot charge below the minimum price. Admin has full control.
              </div>
              <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h3 style={{ fontSize:'14px', fontWeight:700 }}>Services & Pricing Management</h3>
                  <button onClick={() => setShowAddSvc(true)} style={{ background:THEMES[activeTheme].primary, color:'#fff', border:'none', borderRadius:'8px', padding:'8px 14px', fontSize:'12px', fontWeight:700, cursor:'pointer' }}>+ Add Service</button>
                </div>

                {showAddSvc && (
                  <div style={{ padding:'20px', borderBottom:'1px solid #e8e8e8', background:'#f9f9f9' }}>
                    <h4 style={{ fontSize:'13px', fontWeight:700, marginBottom:'12px' }}>Add New Service</h4>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
                      <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>ICON</label><input placeholder="🔧" value={newSvc.icon} onChange={e => setNewSvc({...newSvc,icon:e.target.value})} style={inp} /></div>
                      <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>NAME (EN)</label><input placeholder="Plumbing" value={newSvc.name_en} onChange={e => setNewSvc({...newSvc,name_en:e.target.value})} style={inp} /></div>
                      <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>NAME (नेपाली)</label><input placeholder="प्लम्बिङ" value={newSvc.name_np} onChange={e => setNewSvc({...newSvc,name_np:e.target.value})} style={inp} /></div>
                      <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>BASE PRICE</label><input type="number" value={newSvc.base} onChange={e => setNewSvc({...newSvc,base:Number(e.target.value)})} style={inp} /></div>
                      <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>MIN PRICE</label><input type="number" value={newSvc.min} onChange={e => setNewSvc({...newSvc,min:Number(e.target.value)})} style={inp} /></div>
                      <div><label style={{ fontSize:'11px', fontWeight:700, color:'#666', display:'block', marginBottom:'4px' }}>MAX PRICE</label><input type="number" value={newSvc.max} onChange={e => setNewSvc({...newSvc,max:Number(e.target.value)})} style={inp} /></div>
                    </div>
                    <div style={{ display:'flex', gap:'10px', marginTop:'12px' }}>
                      <button onClick={() => setShowAddSvc(false)} style={{ padding:'8px 16px', border:'1.5px solid #e8e8e8', borderRadius:'8px', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>Cancel</button>
                      <button onClick={() => {
                        if (newSvc.name_en && newSvc.icon) {
                          setServices([...services, { id: services.length+1, ...newSvc, active:true, image:'' }])
                          setNewSvc({ icon:'', name_en:'', name_np:'', base:500, min:200, max:2000 })
                          setShowAddSvc(false)
                          notify('✓ New service added!')
                        }
                      }} style={{ padding:'8px 20px', background:THEMES[activeTheme].primary, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>Save Service</button>
                    </div>
                  </div>
                )}

                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#f9f9f9' }}>
                      {['','Service','Base Price','Min Price','Max Price','Status','Actions'].map(h => (
                        <th key={h} style={{ fontSize:'11px', color:'#666', textAlign:'left', padding:'10px 16px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s.id} style={{ borderTop:'1px solid #e8e8e8' }}>
                        <td style={{ padding:'12px 16px', fontSize:'22px' }}>{s.icon}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ fontWeight:700, fontSize:'13px' }}>{s.name_en}</div>
                          <div style={{ fontSize:'11px', color:'#666' }}>{s.name_np}</div>
                          {s.image && <div style={{ fontSize:'10px', color:'#2563eb', marginTop:'2px' }}>📷 Has image</div>}
                        </td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#16a34a' }}>Rs {s.base}/hr</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'#d97706', fontWeight:600 }}>Rs {s.min}/hr</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'#666' }}>Rs {s.max}/hr</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background: s.active ? '#dcfce7' : '#f3f4f6', color: s.active ? '#16a34a' : '#666', fontSize:'11px', padding:'3px 9px', borderRadius:'10px', fontWeight:600 }}>
                            {s.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button onClick={() => setEditSvc(s)} style={{ background:'#dbeafe', color:'#2563eb', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Edit</button>
                            <button onClick={() => { setServices(services.filter(sv => sv.id !== s.id)); notify('Service deleted') }} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activePage === 'reviews' && (
            <div>
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:'10px', padding:'14px 18px', marginBottom:'18px', fontSize:'13px', color:'#991b1b' }}>
                <strong>⚠ {reviews.filter(r => r.status === 'flagged').length} flagged review(s)</strong> require your attention. Fake or abusive reviews should be hidden or deleted.
              </div>
              <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8' }}>
                  <h3 style={{ fontSize:'14px', fontWeight:700 }}>All Reviews & Reports</h3>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:'#f9f9f9' }}>
                      {['Customer','Tasker','Rating','Comment','Date','Status','Actions'].map(h => (
                        <th key={h} style={{ fontSize:'11px', color:'#666', textAlign:'left', padding:'10px 16px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.4px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((r,i) => (
                      <tr key={i} style={{ borderTop:'1px solid #e8e8e8', background: r.status==='flagged' ? '#fff5f5' : '#fff' }}>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600 }}>{r.customer}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'#666' }}>{r.tasker}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px' }}>{'⭐'.repeat(r.rating)}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color: r.rating <= 2 ? '#dc2626' : '#1a1a1a', maxWidth:'200px' }}>{r.comment}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'#666' }}>{r.date}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background: r.status==='published' ? '#dcfce7' : r.status==='flagged' ? '#fee2e2' : '#f3f4f6', color: r.status==='published' ? '#16a34a' : r.status==='flagged' ? '#dc2626' : '#666', fontSize:'11px', padding:'3px 9px', borderRadius:'10px', fontWeight:600 }}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', gap:'6px' }}>
                            <button onClick={() => { setReviews(reviews.map((rv,j) => j===i ? {...rv,status:'hidden'} : rv)); notify('Review hidden from public') }} style={{ background:'#fef3c7', color:'#d97706', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Hide</button>
                            <button onClick={() => { setReviews(reviews.filter((_,j) => j!==i)); notify('Review deleted') }} style={{ background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:'6px', padding:'4px 10px', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* THEME */}
          {activePage === 'theme' && (
            <div>
              <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8', padding:'24px', marginBottom:'18px' }}>
                <h3 style={{ fontSize:'15px', fontWeight:700, marginBottom:'4px' }}>Color Theme / रङ थिम</h3>
                <p style={{ fontSize:'13px', color:'#666', marginBottom:'20px' }}>Choose a color theme for KaamSathi. This will update the entire platform appearance.</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'12px' }}>
                  {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, th]) => (
                    <div
                      key={key}
                      onClick={() => { setActiveTheme(key); notify(`✓ Theme changed to "${th.name}"!`) }}
                      style={{ border: `2px solid ${activeTheme === key ? th.primary : '#e8e8e8'}`, borderRadius:'10px', overflow:'hidden', cursor:'pointer', transition:'all .2s' }}
                    >
                      <div style={{ height:'60px', background:`linear-gradient(135deg, ${th.secondary}, ${th.primary})` }} />
                      <div style={{ padding:'10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontSize:'12px', fontWeight:600 }}>{th.name}</span>
                        {activeTheme === key && <span style={{ color:th.primary, fontWeight:700, fontSize:'14px' }}>✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8', padding:'24px' }}>
                <h3 style={{ fontSize:'15px', fontWeight:700, marginBottom:'16px' }}>Brand Assets / ब्रान्ड</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'#666', display:'block', marginBottom:'6px' }}>PLATFORM NAME</label>
                    <input defaultValue="KaamSathi" style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'#666', display:'block', marginBottom:'6px' }}>NEPALI NAME</label>
                    <input defaultValue="काम साथी" style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'#666', display:'block', marginBottom:'6px' }}>LOGO URL</label>
                    <input placeholder="https://... or upload to Supabase storage" style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'#666', display:'block', marginBottom:'6px' }}>FAVICON URL</label>
                    <input placeholder="https://..." style={inp} />
                  </div>
                </div>
                <button onClick={() => notify('✓ Brand settings saved!')} style={{ marginTop:'16px', background:t.primary, color:'#fff', border:'none', borderRadius:'8px', padding:'10px 20px', fontWeight:600, cursor:'pointer', fontSize:'13px' }}>Save Brand Settings</button>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {activePage === 'bookings' && (
            <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8', display:'flex', justifyContent:'space-between' }}>
                <h3 style={{ fontSize:'14px', fontWeight:700 }}>All Bookings</h3>
                <select style={{ border:'1px solid #e8e8e8', borderRadius:'6px', padding:'6px 10px', fontSize:'12px', outline:'none' }}>
                  <option>All Status</option><option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
                </select>
              </div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#f9f9f9' }}>{['Ref','Customer','Service','Tasker','Date','Amount','Status'].map(h => <th key={h} style={{ fontSize:'11px', color:'#666', textAlign:'left', padding:'10px 16px', fontWeight:600, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { ref:'KS-1041', customer:'Aarav K.', service:'🔧 Plumbing', tasker:'Ramesh A.', date:'Apr 19', amount:'Rs 2,400', status:'completed' },
                    { ref:'KS-1042', customer:'Nisha T.', service:'🧹 Cleaning', tasker:'Sunita T.', date:'Apr 19', amount:'Rs 1,800', status:'in-progress' },
                    { ref:'KS-1043', customer:'Rohan S.', service:'⚡ Electrical', tasker:'—', date:'Apr 19', amount:'Rs 900', status:'pending' },
                    { ref:'KS-1044', customer:'Priya G.', service:'📚 Tutoring', tasker:'Bikash S.', date:'Apr 18', amount:'Rs 2,100', status:'completed' },
                  ].map((b,i) => (
                    <tr key={i} style={{ borderTop:'1px solid #e8e8e8' }}>
                      <td style={{ padding:'12px 16px', fontSize:'12px', fontWeight:600, color:t.primary }}>{b.ref}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px' }}>{b.customer}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px' }}>{b.service}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', color:'#666' }}>{b.tasker}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'#666' }}>{b.date}</td>
                      <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'#16a34a' }}>{b.amount}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background: b.status==='completed' ? '#dcfce7' : b.status==='in-progress' ? '#dbeafe' : b.status==='pending' ? '#fef3c7' : '#fee2e2', color: b.status==='completed' ? '#16a34a' : b.status==='in-progress' ? '#2563eb' : b.status==='pending' ? '#d97706' : '#dc2626', fontSize:'11px', padding:'3px 9px', borderRadius:'10px', fontWeight:600 }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAYMENTS */}
          {activePage === 'payments' && (
            <div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'18px' }}>
                {[
                  { label:'Total Revenue', val:'Rs 4.2L', color:'#16a34a' },
                  { label:'This Month', val:'Rs 68,400', color:'#2563eb' },
                  { label:'Pending Payouts', val:'Rs 12,300', color:'#d97706' },
                  { label:'Platform Commission', val:'Rs 8,200', color:t.primary },
                ].map((s,i) => (
                  <div key={i} style={{ background:'#fff', borderRadius:'10px', padding:'18px 20px', border:'1px solid #e8e8e8' }}>
                    <div style={{ fontSize:'12px', color:'#666', marginBottom:'6px' }}>{s.label}</div>
                    <div style={{ fontSize:'22px', fontWeight:700, color:s.color }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8' }}>
                <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8', display:'flex', justifyContent:'space-between' }}>
                  <h3 style={{ fontSize:'14px', fontWeight:700 }}>Transactions</h3>
                  <button onClick={() => notify('Report exported!')} style={{ background:'#f4f6fb', border:'1px solid #e8e8e8', borderRadius:'7px', padding:'6px 14px', cursor:'pointer', fontSize:'12px', fontWeight:600 }}>Export CSV</button>
                </div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead><tr style={{ background:'#f9f9f9' }}>{['Booking','Customer','Tasker','Amount','Method','Status'].map(h => <th key={h} style={{ fontSize:'11px', color:'#666', textAlign:'left', padding:'10px 16px', fontWeight:600, textTransform:'uppercase' }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {[
                      { ref:'KS-1041', customer:'Aarav K.', tasker:'Ramesh A.', amount:'Rs 2,400', method:'eSewa', status:'paid' },
                      { ref:'KS-1042', customer:'Nisha T.', tasker:'Sunita T.', amount:'Rs 1,800', method:'Khalti', status:'pending' },
                      { ref:'KS-1044', customer:'Priya G.', tasker:'Bikash S.', amount:'Rs 2,100', method:'Cash', status:'paid' },
                    ].map((p,i) => (
                      <tr key={i} style={{ borderTop:'1px solid #e8e8e8' }}>
                        <td style={{ padding:'12px 16px', fontSize:'12px', fontWeight:600, color:t.primary }}>{p.ref}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px' }}>{p.customer}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'#666' }}>{p.tasker}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600 }}>{p.amount}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', color:'#666' }}>{p.method}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background: p.status==='paid' ? '#dcfce7' : '#fef3c7', color: p.status==='paid' ? '#16a34a' : '#d97706', fontSize:'11px', padding:'3px 9px', borderRadius:'10px', fontWeight:600 }}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activePage === 'settings' && (
            <div style={{ background:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8', padding:'24px' }}>
              <h3 style={{ fontSize:'15px', fontWeight:700, marginBottom:'20px' }}>Platform Settings / सेटिङ</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
                {[
                  { label:'Platform Name', val:'KaamSathi' },
                  { label:'Default Language', val:'', select:['English + Nepali','Nepali Only','English Only'] },
                  { label:'Commission Rate (%)', val:'12', type:'number' },
                  { label:'Default City', val:'', select:['Kathmandu','Pokhara','Chitwan'] },
                  { label:'eSewa Merchant ID', val:'', placeholder:'EPY...' },
                  { label:'Khalti Secret Key', val:'', placeholder:'••••••••', type:'password' },
                  { label:'Google Maps API Key', val:'', placeholder:'AIza...' },
                  { label:'Sparrow SMS Token', val:'', placeholder:'API key...' },
                ].map((f,i) => (
                  <div key={i}>
                    <label style={{ fontSize:'12px', fontWeight:700, color:'#666', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.4px' }}>{f.label}</label>
                    {f.select ? (
                      <select style={inp}>{f.select.map(o => <option key={o}>{o}</option>)}</select>
                    ) : (
                      <input type={f.type || 'text'} defaultValue={f.val} placeholder={f.placeholder} style={inp} />
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                <button style={{ padding:'10px 20px', border:'1.5px solid #e8e8e8', borderRadius:'8px', background:'#fff', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>Reset</button>
                <button onClick={() => notify('✓ Settings saved!')} style={{ padding:'10px 20px', background:t.primary, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>Save All Settings</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}