type ErrorLike = {
  code?: string
  message?: string
  details?: string
  hint?: string
}

const SCHEMA_ERROR_CODES = new Set([
  '42703',
  '42P01',
  'PGRST116',
  'PGRST200',
  'PGRST201',
  'PGRST202',
  'PGRST204',
  'PGRST205',
])

export function getSupabaseErrorMessage(error: unknown) {
  if (!error || typeof error !== 'object') return 'Unknown Supabase error'

  const candidate = error as ErrorLike
  return [
    candidate.code,
    candidate.message,
    candidate.details,
    candidate.hint,
  ]
    .filter(Boolean)
    .join(' | ')
}

export function isSchemaDriftError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const candidate = error as ErrorLike
  const message = `${candidate.message || ''} ${candidate.details || ''} ${
    candidate.hint || ''
  }`.toLowerCase()

  if (candidate.code && SCHEMA_ERROR_CODES.has(candidate.code)) {
    return true
  }

  return (
    message.includes('schema cache') ||
    message.includes('could not find') ||
    message.includes('does not exist') ||
    message.includes('column') ||
    message.includes('relationship') ||
    message.includes('table')
  )
}

export function warnSchemaDrift(context: string, error: unknown) {
  console.warn(`[Supabase contract] ${context}: ${getSupabaseErrorMessage(error)}`)
}

export function asRecord(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

export function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

export function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

export function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}
