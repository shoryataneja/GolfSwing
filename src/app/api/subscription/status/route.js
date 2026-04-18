import { getSubscription } from '@/services/subscription.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const sub = await getSubscription(userId)
    return apiSuccess(sub)
  } catch (err) {
    return apiError(err.message)
  }
}
