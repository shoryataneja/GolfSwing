import { supabaseAdmin } from '@/lib/db'
import { getTotalDonationsByCharity } from '@/services/charity.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET() {
  try {
    const [
      { count: totalUsers },
      { count: activeSubscriptions },
      { data: recentDraws },
      donationsByCharity,
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabaseAdmin.from('draws').select('prize_pool, draw_month').eq('status', 'published').order('draw_month', { ascending: false }).limit(6),
      getTotalDonationsByCharity(),
    ])

    const totalPrizePool = (recentDraws || []).reduce((sum, d) => sum + parseFloat(d.prize_pool || 0), 0)
    const totalDonations = donationsByCharity.reduce((sum, d) => sum + d.total, 0)

    return apiSuccess({
      totalUsers,
      activeSubscriptions,
      totalPrizePool: parseFloat(totalPrizePool.toFixed(2)),
      totalDonations: parseFloat(totalDonations.toFixed(2)),
      recentDraws: recentDraws || [],
      donationsByCharity,
    })
  } catch (err) {
    return apiError(err.message)
  }
}
