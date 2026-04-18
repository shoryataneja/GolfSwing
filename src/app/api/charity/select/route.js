import { selectCharity } from '@/services/charity.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { charityId, charityPct } = await request.json()
    if (!charityId) return apiError('charityId is required')

    const data = await selectCharity(userId, charityId, charityPct)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}
