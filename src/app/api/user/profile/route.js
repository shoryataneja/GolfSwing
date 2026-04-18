import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, charity_id, charity_pct, created_at, charities(id, name, description)')
      .eq('id', userId)
      .single()
    if (error) return apiError('User not found', 404)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function PATCH(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { fullName } = await request.json()
    if (!fullName) return apiError('fullName is required')

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ full_name: fullName })
      .eq('id', userId)
      .select('id, email, full_name, role')
      .single()
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}
