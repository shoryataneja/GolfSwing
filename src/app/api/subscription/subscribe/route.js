import { subscribe, getSubscription } from '@/services/subscription.service'
import { recordDonation } from '@/services/charity.service'
import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { plan } = await request.json()
    if (!plan) return apiError('plan is required')

    const sub = await subscribe(userId, plan)

    // Record charity donation if user has selected one
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('charity_id, charity_pct')
      .eq('id', userId)
      .single()

    if (user?.charity_id) {
      await recordDonation(userId, user.charity_id, sub.amount, user.charity_pct)
    }

    return apiSuccess(sub, 201)
  } catch (err) {
    return apiError(err.message)
  }
}
