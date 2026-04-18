import { supabaseAdmin } from '@/lib/db'
import { addMonths, addYears } from '@/lib/utils'

const PLANS = {
  monthly: { amount: 299, label: 'Monthly' },
  yearly:  { amount: 2999, label: 'Yearly' },
}

export async function subscribe(userId, plan) {
  if (!PLANS[plan]) throw new Error('Invalid plan')

  const now = new Date()
  const expiresAt = plan === 'yearly' ? addYears(now, 1) : addMonths(now, 1)

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        plan,
        status: 'active',
        amount: PLANS[plan].amount,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getSubscription(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  if (!data) return null

  // Auto-expire if past expiry date
  if (data.status === 'active' && new Date(data.expires_at) < new Date()) {
    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('id', data.id)
    return { ...data, status: 'expired' }
  }
  return data
}

export async function isSubscribed(userId) {
  const sub = await getSubscription(userId)
  return sub?.status === 'active'
}

export async function cancelSubscription(userId) {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}

export async function countActiveSubscriptions() {
  const { count, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  if (error) throw new Error(error.message)
  return count || 0
}
