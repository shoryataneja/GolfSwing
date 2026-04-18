import { getCharities } from '@/services/charity.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET() {
  try {
    const charities = await getCharities()
    return apiSuccess(charities)
  } catch (err) {
    return apiError(err.message)
  }
}
