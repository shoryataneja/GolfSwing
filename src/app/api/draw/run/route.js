import { runDraw } from '@/services/draw.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function POST(request) {
  try {
    const role = request.headers.get('x-user-role')
    if (role !== 'admin') return apiError('Forbidden', 403)

    const body = await request.json().catch(() => ({}))
    const result = await runDraw(body.drawMonth)
    return apiSuccess(result)
  } catch (err) {
    return apiError(err.message)
  }
}
