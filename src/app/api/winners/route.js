import { getUserWinnings } from '@/services/draw.service'
import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const winnings = await getUserWinnings(userId)
    return apiSuccess(winnings)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function PATCH(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { winnerId, proofUrl } = await request.json()
    if (!winnerId || !proofUrl) return apiError('winnerId and proofUrl are required')

    const { data, error } = await supabaseAdmin
      .from('winners')
      .update({ proof_url: proofUrl })
      .eq('id', winnerId)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}
