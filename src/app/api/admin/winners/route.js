import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const drawId = searchParams.get('drawId')

    let query = supabaseAdmin
      .from('winners')
      .select('*, users(full_name, email), draws(draw_month, numbers)')
      .order('created_at', { ascending: false })

    if (drawId) query = query.eq('draw_id', drawId)

    const { data, error } = await query
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function PATCH(request) {
  try {
    const { winnerId, verification, paymentStatus } = await request.json()
    if (!winnerId) return apiError('winnerId is required')

    const updates = {}
    if (verification) updates.verification = verification
    if (paymentStatus) updates.payment_status = paymentStatus

    const { data, error } = await supabaseAdmin
      .from('winners')
      .update(updates)
      .eq('id', winnerId)
      .select()
      .single()
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}
