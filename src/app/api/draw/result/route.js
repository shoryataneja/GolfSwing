import { getDrawHistory, getDrawWithWinners } from '@/services/draw.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const drawId = searchParams.get('drawId')

    if (drawId) {
      const result = await getDrawWithWinners(drawId)
      return apiSuccess(result)
    }

    const history = await getDrawHistory()
    return apiSuccess(history)
  } catch (err) {
    return apiError(err.message)
  }
}
