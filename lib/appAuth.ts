import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import {
  asNumber,
  asString,
  getSupabaseErrorMessage,
  isSchemaDriftError,
  warnSchemaDrift,
} from './supabaseSafe'

type AppRole = 'customer' | 'tasker'

export type ProfileSnapshot = {
  id: string
  points: number
  referredBy: string | null
}

const REFERRAL_STORAGE_KEY = 'kaamsathi_referrer'

export function storeReferral(referrerId: string) {
  if (typeof window === 'undefined' || !referrerId) return
  localStorage.setItem(REFERRAL_STORAGE_KEY, referrerId)
}

export function getStoredReferral() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFERRAL_STORAGE_KEY)
}

export function clearStoredReferral() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(REFERRAL_STORAGE_KEY)
}

async function upsertUserRow(
  userId: string,
  payload: Record<string, string | null>
) {
  const variants = [
    payload,
    {
      id: userId,
      full_name: payload.full_name,
      phone: payload.phone,
      role: payload.role,
    },
    {
      id: userId,
      full_name: payload.full_name,
      role: payload.role,
    },
    {
      id: userId,
      role: payload.role,
    },
    { id: userId },
  ]

  for (const variant of variants) {
    const { error } = await supabase.from('users').upsert(variant, {
      onConflict: 'id',
    })

    if (!error) return

    if (!isSchemaDriftError(error)) {
      console.warn(
        `[Supabase contract] users upsert failed: ${getSupabaseErrorMessage(error)}`
      )
      return
    }

    warnSchemaDrift('users upsert fallback', error)
  }
}

async function upsertProfileRow(
  userId: string,
  payload: {
    points?: number
    referred_by?: string
  }
) {
  const variants = [
    { id: userId, ...payload },
    payload.referred_by
      ? { id: userId, referred_by: payload.referred_by }
      : { id: userId, points: payload.points ?? 0 },
    { id: userId },
  ]

  for (const variant of variants) {
    const { error } = await supabase.from('profiles').upsert(variant, {
      onConflict: 'id',
    })

    if (!error) return

    if (!isSchemaDriftError(error)) {
      console.warn(
        `[Supabase contract] profiles upsert failed: ${getSupabaseErrorMessage(error)}`
      )
      return
    }

    warnSchemaDrift('profiles upsert fallback', error)
  }
}

export async function getProfileSnapshot(userId: string): Promise<ProfileSnapshot> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, points, referred_by')
    .eq('id', userId)
    .maybeSingle()

  if (!error && data) {
    return {
      id: asString(data.id, userId),
      points: asNumber(data.points, 0),
      referredBy: typeof data.referred_by === 'string' ? data.referred_by : null,
    }
  }

  if (error) {
    if (isSchemaDriftError(error)) {
      warnSchemaDrift('profiles read fallback', error)
    } else {
      console.warn(
        `[Supabase contract] profiles read failed: ${getSupabaseErrorMessage(error)}`
      )
    }
  }

  const { data: fallbackData, error: fallbackError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (fallbackError) {
    if (isSchemaDriftError(fallbackError)) {
      warnSchemaDrift('profiles minimal read fallback', fallbackError)
    } else {
      console.warn(
        `[Supabase contract] profiles minimal read failed: ${getSupabaseErrorMessage(
          fallbackError
        )}`
      )
    }
  }

  return {
    id: asString(fallbackData?.id),
    points: 0,
    referredBy: null,
  }
}

export async function countReferredUsers(userId: string) {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('referred_by', userId)

  if (!error) return count ?? 0

  if (isSchemaDriftError(error)) {
    warnSchemaDrift('profiles referral count fallback', error)
    return 0
  }

  console.warn(
    `[Supabase contract] referral count failed: ${getSupabaseErrorMessage(error)}`
  )
  return 0
}

export async function updateProfilePoints(userId: string, points: number) {
  const variants = [{ points }, {}]

  for (const variant of variants) {
    const { error } = await supabase.from('profiles').update(variant).eq('id', userId)
    if (!error) return

    if (!isSchemaDriftError(error)) {
      console.warn(
        `[Supabase contract] profiles update failed: ${getSupabaseErrorMessage(error)}`
      )
      return
    }

    warnSchemaDrift('profiles update fallback', error)
  }
}

export async function insertOptionalReferralPayout(payload: {
  referrer_id: string | null
  referee_id: string
  amount: number
  status: string
}) {
  const variants = [
    payload,
    {
      referrer_id: payload.referrer_id,
      referee_id: payload.referee_id,
      amount: payload.amount,
    },
    {
      referee_id: payload.referee_id,
      amount: payload.amount,
    },
  ]

  for (const variant of variants) {
    const { error } = await supabase.from('referral_payouts').insert(variant)
    if (!error) return

    if (!isSchemaDriftError(error)) {
      console.warn(
        `[Supabase contract] referral payout insert failed: ${getSupabaseErrorMessage(
          error
        )}`
      )
      return
    }

    warnSchemaDrift('referral payout insert fallback', error)
  }
}

export async function insertOptionalPayment(payload: {
  booking_id: string
  amount: number
  method: string
  commission: number
  tasker_payout: number
  status: string
}) {
  const variants = [
    payload,
    {
      booking_id: payload.booking_id,
      amount: payload.amount,
      method: payload.method,
      status: payload.status,
    },
    {
      booking_id: payload.booking_id,
      amount: payload.amount,
      method: payload.method,
    },
  ]

  for (const variant of variants) {
    const { error } = await supabase.from('payments').insert(variant)
    if (!error) return

    if (!isSchemaDriftError(error)) {
      console.warn(
        `[Supabase contract] payment insert failed: ${getSupabaseErrorMessage(error)}`
      )
      return
    }

    warnSchemaDrift('payment insert fallback', error)
  }
}

export async function ensureUserRecords(user: User, role: AppRole) {
  const fullName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0] ||
    user.phone ||
    'KaamSathi User'

  const phone =
    typeof user.phone === 'string' ? user.phone.replace(/^\+977/, '') : null

  await upsertUserRow(user.id, {
    id: user.id,
    full_name: fullName,
    phone,
    role,
    city: 'Kathmandu',
  })

  const existingProfile = await getProfileSnapshot(user.id)
  const storedReferrer = getStoredReferral()
  const profilePayload: {
    id: string
    points: number
    referred_by?: string
  } = {
    id: user.id,
    points: existingProfile.points,
  }

  if (
    !existingProfile.referredBy &&
    storedReferrer &&
    storedReferrer !== user.id
  ) {
    profilePayload.referred_by = storedReferrer
  }

  await upsertProfileRow(user.id, {
    points: profilePayload.points,
    referred_by: profilePayload.referred_by,
  })

  if (profilePayload.referred_by) {
    clearStoredReferral()
  }
}

export async function ensureProfileRow(userId: string) {
  const existingProfile = await getProfileSnapshot(userId)

  if (!existingProfile.id) {
    await upsertProfileRow(userId, { points: 0 })
  }
}

export async function getTaskerProfile(userId: string) {
  const { data, error } = await supabase
    .from('taskers')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    if (isSchemaDriftError(error)) {
      warnSchemaDrift('taskers profile read fallback', error)
      return null
    }

    console.warn(
      `[Supabase contract] tasker profile read failed: ${getSupabaseErrorMessage(error)}`
    )
    return null
  }

  return data
}
