import { publishDraw, getDrawWithWinners } from '@/services/draw.service'
import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .select('*')
      .order('draw_month', { ascending: false })
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function POST(request) {
  try {
    const { drawId } = await request.json()
    if (!drawId) return apiError('drawId is required')
    const draw = await publishDraw(drawId)
    return apiSuccess(draw)
  } catch (err) {
    return apiError(err.message)
  }
}
