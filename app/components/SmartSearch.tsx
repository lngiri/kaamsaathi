'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getMatchedSkills, scoreTasker } from '@/lib/keywords'
import { theme } from '@/lib/theme'
import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  asStringArray,
  getSupabaseErrorMessage,
  isSchemaDriftError,
  warnSchemaDrift,
} from '@/lib/supabaseSafe'

type Tasker = {
  id: string
  user_id: string
  bio: string
  skills: string[]
  hourly_rate: number
  city: string
  lat: number
  lng: number
  rating: number
  total_tasks: number
  is_online: boolean
  status: string
  users: {
    full_name: string
    avatar_url: string
    phone: string
  }
  score?: number
  matchedSkills?: string[]
}

const SUGGESTIONS = [
  { label: 'धारा ठीक गर्नुस्', hint: 'Fix tap' },
  { label: 'घर सफाई', hint: 'House cleaning' },
  { label: 'बिजुली काम', hint: 'Electrical' },
  { label: 'खाना पकाउने', hint: 'Cooking' },
  { label: 'ट्युसन', hint: 'Tutoring' },
  { label: 'सामान सार्ने', hint: 'Moving' },
  { label: 'computer repair', hint: 'Tech help' },
  { label: 'बगैंचा काम', hint: 'Gardening' },
]

type Props = {
  city?: string
  onSelect?: (tasker: Tasker) => void
  placeholder?: string
}

function normalizeTasker(row: unknown): Tasker {
  const record = asRecord(row)
  const userRecord = asRecord(record?.users)

  return {
    id: asString(record?.id),
    user_id: asString(record?.user_id),
    bio: asString(record?.bio),
    skills: asStringArray(record?.skills),
    hourly_rate: asNumber(record?.hourly_rate, 0),
    city: asString(record?.city, 'Kathmandu'),
    lat: asNumber(record?.lat, 0),
    lng: asNumber(record?.lng, 0),
    rating: asNumber(record?.rating, 0),
    total_tasks: asNumber(record?.total_tasks, 0),
    is_online: asBoolean(record?.is_online, false),
    status: asString(record?.status, 'active'),
    users: {
      full_name: asString(userRecord?.full_name, 'Tasker'),
      avatar_url: asString(userRecord?.avatar_url),
      phone: asString(userRecord?.phone),
    },
  }
}

export default function SmartSearch({ city = 'Kathmandu', onSelect, placeholder }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Tasker[]>([])
  const [matchedSkills, setMatchedSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setFocused(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setMatchedSkills([]); return }
    setLoading(true)
    const skills = getMatchedSkills(q)
    setMatchedSkills(skills)

    try {
      // Build query — search by name, city, or skills
      let dbQuery = supabase
        .from('taskers')
        .select('*, users(full_name, avatar_url, phone)')
        .eq('status', 'active')

      // Filter by matched skills if any
      if (skills.length > 0) {
        dbQuery = dbQuery.overlaps('skills', skills)
      }

      let { data, error } = await dbQuery.limit(20)
      if (error && isSchemaDriftError(error)) {
        warnSchemaDrift('taskers smart search relation fallback', error)
        const fallbackResponse = await supabase
          .from('taskers')
          .select('*')
          .limit(20)
        data = fallbackResponse.data
        error = fallbackResponse.error
      }
      if (error && isSchemaDriftError(error)) {
        warnSchemaDrift('taskers smart search minimal fallback', error)
        setResults([])
        return
      }
      if (error) throw error

      // Score and sort results
      const scored = (data || [])
        .map((item) => normalizeTasker(item))
        .map(t => {
          const { score, matchedSkills: ms } = scoreTasker(
            { name: t.users?.full_name || '', city: t.city, skills: t.skills },
            q
          )
          return { ...t, score, matchedSkills: ms }
        })
        .filter(t => t.score > 0)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

      setResults(scored)
    } catch (err) {
      console.error(
        'Search error:',
        err instanceof Error ? err.message : getSupabaseErrorMessage(err)
      )
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, doSearch])

  const handleSelect = (tasker: Tasker) => {
    setFocused(false)
    if (onSelect) {
      onSelect(tasker)
    } else {
      router.push(`/tasker/${tasker.id}`)
    }
  }

  const handleSearch = () => {
    setFocused(false)
    router.push(`/browse?search=${encodeURIComponent(query)}&city=${city}`)
  }

  const showDrop = focused && query.length > 0

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Search Input */}
      <div style={{
        display: 'flex', background: '#fff',
        borderRadius: '14px', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        border: focused ? `2px solid ${theme.primary}` : '2px solid transparent',
        transition: 'border .2s'
      }}>
        <div style={{ padding: '14px 16px', fontSize: '20px', flexShrink: 0 }}>🔍</div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder || 'धारा ठीक गर्नुस् / fix tap / सफाई / clean house...'}
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontSize: '15px', padding: '14px 0',
            background: 'transparent', color: theme.text,
            fontFamily: theme.fontFamily, minWidth: 0
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}
            style={{ padding: '14px 12px', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '18px' }}
          >✕</button>
        )}
        {loading && (
          <div style={{ padding: '14px 12px', color: theme.muted, fontSize: '13px' }}>...</div>
        )}
        <button
          onClick={handleSearch}
          style={{
            background: theme.primary, color: '#fff',
            border: 'none', padding: '0 22px',
            fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', borderRadius: '0 12px 12px 0',
            flexShrink: 0
          }}
        >
          खोज्नुस्
        </button>
      </div>

      {/* Suggestions */}
      {!focused && !query && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginTop: '12px' }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s.label}
              onClick={() => { setQuery(s.label); setFocused(true); inputRef.current?.focus() }}
              style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '20px', padding: '5px 13px',
                fontSize: '12px', cursor: 'pointer'
              }}
            >
              {s.label} <span style={{ opacity: 0.65 }}>— {s.hint}</span>
            </button>
          ))}
        </div>
      )}

      {/* Live Dropdown */}
      {showDrop && (
        <div
          ref={dropRef}
          style={{
            position: 'absolute', top: 'calc(100% + 8px)',
            left: 0, right: 0, background: '#fff',
            borderRadius: '14px', zIndex: 200,
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden'
          }}
        >
          {/* Matched skills */}
          {matchedSkills.length > 0 && (
            <div style={{
              padding: '8px 16px', background: '#fff8f8',
              borderBottom: `1px solid ${theme.primaryLight}`,
              display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '11px', color: theme.muted }}>Matched:</span>
              {matchedSkills.map(s => (
                <span key={s} style={{
                  background: theme.primaryLight, color: theme.primary,
                  fontSize: '11px', padding: '2px 9px', borderRadius: '10px', fontWeight: 700
                }}>{s}</span>
              ))}
            </div>
          )}

          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {results.length === 0 && !loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: theme.muted }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🔍</div>
                <p style={{ fontSize: '13px' }}>No taskers found for &quot;{query}&quot;</p>
                <button
                  onClick={() => router.push('/post-task')}
                  style={{ marginTop: '10px', background: theme.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                >
                  + Post a Task Instead
                </button>
              </div>
            ) : (
              <>
                <div style={{ padding: '8px 16px 2px', fontSize: '10px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {results.length} taskers found — nearest first
                </div>
                {results.map(t => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect(t)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '11px 16px', cursor: 'pointer',
                      borderBottom: `1px solid #f5f5f5`, transition: 'background .12s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%',
                      background: theme.primary, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: 700, color: '#fff',
                      flexShrink: 0, position: 'relative'
                    }}>
                      {t.users?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'T'}
                      <div style={{
                        position: 'absolute', bottom: '1px', right: '1px',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: t.is_online ? '#16a34a' : '#ccc',
                        border: '2px solid #fff'
                      }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>
                          {t.users?.full_name || 'Tasker'}
                        </span>
                        {t.is_online && (
                          <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '9px', padding: '1px 5px', borderRadius: '6px', fontWeight: 700 }}>ONLINE</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: theme.muted, margin: '1px 0' }}>
                        📍 {t.city} · ⭐ {t.rating} · {t.total_tasks} tasks
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(t.skills || []).map(s => (
                          <span key={s} style={{
                            background: t.matchedSkills?.includes(s) ? theme.primaryLight : '#f3f4f6',
                            color: t.matchedSkills?.includes(s) ? theme.primary : theme.muted,
                            fontSize: '10px', padding: '1px 6px', borderRadius: '6px',
                            fontWeight: t.matchedSkills?.includes(s) ? 700 : 400
                          }}>
                            {t.matchedSkills?.includes(s) ? '✓ ' : ''}{s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#16a34a' }}>
                        Rs {t.hourly_rate}
                      </div>
                      <div style={{ fontSize: '10px', color: theme.muted }}>/hr</div>
                    </div>
                  </div>
                ))}

                {/* See all results */}
                <div
                  onClick={handleSearch}
                  style={{ padding: '12px 16px', textAlign: 'center', fontSize: '13px', color: theme.primary, fontWeight: 600, cursor: 'pointer', borderTop: `1px solid ${theme.border}` }}
                >
                  See all {results.length} results for &quot;{query}&quot; →
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
