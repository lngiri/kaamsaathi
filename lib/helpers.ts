// ================================================================
// KaamSathi — Helper / Utility Functions
// ================================================================

// ── Generate booking reference code ──────────────────────────
export function generateRef(): string {
  const year = new Date().getFullYear()
  const num = Math.floor(1000 + Math.random() * 9000)
  return `KS-${year}-${num}`
}

// ── Format price in Nepali style ─────────────────────────────
export function formatPrice(amount: number): string {
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `Rs ${amount.toLocaleString()}`
  return `Rs ${amount}`
}

// ── Format distance ───────────────────────────────────────────
export function formatDist(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m away`
  return `${km.toFixed(1)} km away`
}

// ── Format date in Nepali friendly way ───────────────────────
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-NP', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  })
}

// ── Get today's date string for date inputs ───────────────────
export function today(): string {
  return new Date().toISOString().split('T')[0]
}

// ── Validate Nepali phone number ──────────────────────────────
export function isValidPhone(phone: string): boolean {
  return /^9[678]\d{8}$/.test(phone)
}

// ── Validate email ────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Truncate text ─────────────────────────────────────────────
export function truncate(text: string, len = 80): string {
  if (!text) return ''
  return text.length > len ? text.slice(0, len) + '...' : text
}

// ── Get initials from name ────────────────────────────────────
export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ── Status badge colors ───────────────────────────────────────
export function statusColor(status: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    active:      { bg: '#dcfce7', text: '#16a34a' },
    pending:     { bg: '#fef3c7', text: '#d97706' },
    completed:   { bg: '#dcfce7', text: '#16a34a' },
    cancelled:   { bg: '#fee2e2', text: '#dc2626' },
    suspended:   { bg: '#fee2e2', text: '#dc2626' },
    'in-progress':{ bg: '#dbeafe', text: '#2563eb' },
    matching:    { bg: '#fef3c7', text: '#d97706' },
    paid:        { bg: '#dcfce7', text: '#16a34a' },
    unpaid:      { bg: '#fee2e2', text: '#dc2626' },
    held:        { bg: '#fef3c7', text: '#d97706' },
    published:   { bg: '#dcfce7', text: '#16a34a' },
    flagged:     { bg: '#fee2e2', text: '#dc2626' },
    hidden:      { bg: '#f3f4f6', text: '#6b7280' },
  }
  return map[status] || { bg: '#f3f4f6', text: '#6b7280' }
}

// ── Calculate tasker payout (88%) ────────────────────────────
export function calcPayout(total: number): {
  commission: number
  payout: number
} {
  const commission = Math.round(total * 0.12)
  const payout = total - commission
  return { commission, payout }
}

// ── Cities list ───────────────────────────────────────────────
export const NEPAL_CITIES = [
  'Kathmandu', 'Lalitpur', 'Bhaktapur',
  'Pokhara', 'Chitwan', 'Butwal',
  'Biratnagar', 'Dharan', 'Hetauda',
  'Nepalgunj', 'Birgunj', 'Janakpur',
]

// ── Services list ────────────────────────────────────────────
export const SERVICE_LIST = [
  { name_en: 'Plumbing',    name_np: 'प्लम्बिङ',      icon: '🔧', base: 800  },
  { name_en: 'Cleaning',    name_np: 'सफाई',           icon: '🧹', base: 600  },
  { name_en: 'Electrical',  name_np: 'विद्युत',        icon: '⚡', base: 900  },
  { name_en: 'Moving',      name_np: 'सरसामान सार्ने', icon: '📦', base: 1200 },
  { name_en: 'Tutoring',    name_np: 'ट्युसन',         icon: '📚', base: 700  },
  { name_en: 'Cooking',     name_np: 'खाना पकाउने',    icon: '🍳', base: 650  },
  { name_en: 'Painting',    name_np: 'रङ लगाउने',      icon: '🎨', base: 750  },
  { name_en: 'Tech Help',   name_np: 'प्राविधिक',      icon: '💻', base: 1000 },
  { name_en: 'Gardening',   name_np: 'बागवानी',        icon: '🌿', base: 600  },
  { name_en: 'Caretaking',  name_np: 'स्याहार',        icon: '👨‍⚕️', base: 700 },
  { name_en: 'Driver',      name_np: 'चालक',           icon: '🚗', base: 900  },
  { name_en: 'Pet Care',    name_np: 'पाल्तु स्याहार', icon: '🐾', base: 600  },
]