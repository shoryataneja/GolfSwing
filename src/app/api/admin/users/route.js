import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const from = (page - 1) * limit

    const { data, error, count } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, created_at, subscriptions(plan, status, expires_at), charities(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1)

    if (error) return apiError(error.message)
    return apiSuccess({ users: data, total: count, page, limit })
  } catch (err) {
    return apiError(err.message)
  }
}
