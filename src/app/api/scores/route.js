import { getScores, addScore, deleteScore } from '@/services/score.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const scores = await getScores(userId)
    return apiSuccess(scores)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { score, scoreDate } = await request.json()

    if (!score || !scoreDate) return apiError('score and scoreDate are required')
    if (score < 1 || score > 45) return apiError('Score must be between 1 and 45')

    const data = await addScore(userId, { score: parseInt(score), scoreDate })
    return apiSuccess(data, 201)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function DELETE(request) {
  try {
    const userId = request.headers.get('x-user-id')
    const { searchParams } = new URL(request.url)
    const scoreId = searchParams.get('id')
    if (!scoreId) return apiError('Score ID is required')

    await deleteScore(userId, scoreId)
    return apiSuccess({ deleted: true })
  } catch (err) {
    return apiError(err.message)
  }
}
