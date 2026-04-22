'use client'
import { useRouter } from 'next/navigation'
import { theme } from '@/lib/theme'
import { formatPrice, formatDist } from '@/lib/helpers'

type Tasker = {
  id?: string | number
  name?: string
  hourly_rate?: number
  price?: number
  city: string
  skills: string[]
  rating: number
  neighborhood_score?: number // Added for neighborhood reviews
  total_tasks?: number
  tasks?: number
  is_online?: boolean
  online?: boolean
  lat?: number
  lng?: number
  matchedSkills?: string[]
  nep?: string
  bg?: string
  users?: {
    full_name: string
    avatar_url?: string
  }
}

type Props = {
  tasker: Tasker
  view?: 'grid' | 'list'
  onBook?: (tasker: Tasker) => void
  highlight?: string[]
}

const AVATAR_COLORS = [
  '#DC143C','#003893','#1a7a4a','#2563EB','#7c3aed',
  '#0891b2','#be185d','#15803d','#b45309',
]

function getColor(id: string | number): string {
  let hash = 0
  const sId = String(id)
  for (let i = 0; i < sId.length; i++) hash = sId.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string): string {
  return (name || 'T').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function TaskerCard({ tasker, view = 'grid', onBook, highlight = [] }: Props) {
  const router = useRouter()
  const name = tasker.users?.full_name || tasker.name || 'Tasker'
  const initials = getInitials(name)
  const taskerId = tasker.id ?? name
  const color = tasker.bg || getColor(taskerId)
  const matchedSkills = tasker.matchedSkills || highlight
  const isOnline = tasker.is_online ?? tasker.online ?? false
  const rate = tasker.hourly_rate ?? tasker.price ?? 0
  const reviewCount = tasker.total_tasks ?? tasker.tasks ?? 0
  const avatarChar = tasker.nep || initials

  const isList = view === 'list'

  return (
    <div
      style={{
        background: '#fff',
        border: `1.5px solid ${theme.border}`,
        borderRadius: theme.radiusLg,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .2s',
        display: isList ? 'flex' : 'block',
        fontFamily: theme.fontFamily,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = theme.shadowLg
        e.currentTarget.style.borderColor = '#ddd'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
        e.currentTarget.style.borderColor = theme.border
      }}
    >
      {/* Top section */}
      <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: '14px', flex: isList ? 1 : 'unset' }}>
        {/* Avatar */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {tasker.users?.avatar_url ? (
            <div
              role="img"
              aria-label={name}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundImage: `url("${tasker.users.avatar_url}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ) : (
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#fff'
            }}>
              {avatarChar}
            </div>
          )}
          <div style={{
            position: 'absolute', bottom: '1px', right: '1px',
            width: '13px', height: '13px', borderRadius: '50%',
            background: isOnline ? '#16a34a' : '#ccc',
            border: '2px solid #fff'
          }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px', color: theme.text }}>{name}</h3>
          <div style={{ fontSize: '12px', color: theme.muted, marginBottom: '5px' }}>
            📍 {tasker.city}
            {tasker.lat && ' · '}
            <span style={{ color: theme.blue }}>
              {tasker.lat ? `${formatDist(tasker.lat)}` : ''}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '5px' }}>
            {'★'.repeat(Math.round(tasker.rating))}
            <strong style={{ color: theme.text, marginLeft: '4px' }}>{tasker.rating.toFixed(1)}</strong>
            <span style={{ color: theme.muted }}> ({reviewCount} reviews)</span>
          </div>
          {tasker.neighborhood_score && (
            <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '3px' }}>
              ⭐ <strong style={{ color: theme.text }}>{tasker.neighborhood_score.toFixed(1)}</strong> <span style={{ color: theme.muted }}>(Neighborhood Score)</span>
            </div>
          )}

          {/* Skills */}
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {(tasker.skills || []).map(s => (
              <span key={s} style={{
                background: matchedSkills.includes(s) ? theme.primaryLight : '#f3f4f6',
                color: matchedSkills.includes(s) ? theme.primary : theme.muted,
                fontSize: '10px', padding: '2px 8px', borderRadius: '8px',
                fontWeight: matchedSkills.includes(s) ? 700 : 400
              }}>
                {matchedSkills.includes(s) ? '✓ ' : ''}{s}
              </span>
            ))}
            <span style={{
              background: isOnline ? '#dcfce7' : '#f3f4f6',
              color: isOnline ? '#16a34a' : theme.muted,
              fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: 500
            }}>
              {isOnline ? '● Online' : '○ Offline'}
            </span>
          </div>
        </div>

        {/* Price */}
        {isList && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a' }}>
              {formatPrice(rate)}<span style={{ fontSize: '11px', color: theme.muted, fontWeight: 400 }}>/hr</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div style={{
        padding: '10px 18px 14px',
        borderTop: isList ? 'none' : `1px solid ${theme.border}`,
        borderLeft: isList ? `1px solid ${theme.border}` : 'none',
        display: 'flex', gap: '8px', alignItems: 'center',
        minWidth: isList ? '200px' : 'unset'
      }}>
        {!isList && (
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a' }}>
              {formatPrice(rate)}<span style={{ fontSize: '11px', color: theme.muted, fontWeight: 400 }}>/hr</span>
            </span>
          </div>
        )}
        <button
          onClick={() => onBook ? onBook(tasker) : router.push(`/tasker/${tasker.id ?? ''}`)}
          style={{
            flex: 1, padding: '8px', background: theme.primary, color: '#fff',
            border: 'none', borderRadius: '8px', fontWeight: 600,
            fontSize: '13px', cursor: 'pointer'
          }}
        >
          📅 Book Now
        </button>
        <button
          onClick={() => router.push(`/tasker/${tasker.id ?? ''}`)}
          style={{
            flex: 1, padding: '8px', background: '#fff', color: theme.text,
            border: `1.5px solid ${theme.border}`, borderRadius: '8px',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer'
          }}
        >
          👤 Profile
        </button>
      </div>
    </div>
  )
}
