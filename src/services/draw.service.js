import { supabaseAdmin } from '@/lib/db'
import { generateDrawNumbers, matchScores, getCurrentMonth } from '@/lib/utils'
import { countActiveSubscriptions } from './subscription.service'

const MONTHLY_PRICE = 299
const PRIZE_SPLIT = { 5: 0.40, 4: 0.35, 3: 0.25 }

async function calculatePrizePool(rollover = 0) {
  const activeCount = await countActiveSubscriptions()
  const pool = activeCount * MONTHLY_PRICE * 0.5 // 50% of revenue goes to prize pool
  return parseFloat((pool + rollover).toFixed(2))
}

export async function runDraw(drawMonth = getCurrentMonth()) {
  // Check if draw already exists for this month
  const { data: existing } = await supabaseAdmin
    .from('draws')
    .select('id, status')
    .eq('draw_month', drawMonth)
    .single()
  if (existing?.status === 'published') throw new Error('Draw already published for this month')

  // Get previous jackpot rollover
  const { data: prevDraw } = await supabaseAdmin
    .from('draws')
    .select('jackpot_rollover, jackpot_amount')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const rollover = prevDraw?.jackpot_rollover || 0
  const prizePool = await calculatePrizePool(rollover)
  const numbers = generateDrawNumbers()

  const drawData = {
    draw_month: drawMonth,
    numbers,
    status: 'simulated',
    prize_pool: prizePool,
    jackpot_amount: parseFloat((prizePool * PRIZE_SPLIT[5]).toFixed(2)),
    tier2_amount: parseFloat((prizePool * PRIZE_SPLIT[4]).toFixed(2)),
    tier3_amount: parseFloat((prizePool * PRIZE_SPLIT[3]).toFixed(2)),
    jackpot_rollover: 0,
  }

  let draw
  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .update(drawData)
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    draw = data
  } else {
    const { data, error } = await supabaseAdmin
      .from('draws')
      .insert(drawData)
      .select()
      .single()
    if (error) throw new Error(error.message)
    draw = data
  }

  // Match all active subscribers' scores
  const winners = await matchWinners(draw)
  return { draw, winners }
}

async function matchWinners(draw) {
  // Get all active subscribers with their scores
  const { data: activeSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')

  if (!activeSubs?.length) return []

  const userIds = activeSubs.map(s => s.user_id)

  const { data: scores } = await supabaseAdmin
    .from('scores')
    .select('user_id, score')
    .in('user_id', userIds)

  // Group scores by user
  const scoresByUser = {}
  for (const s of scores || []) {
    if (!scoresByUser[s.user_id]) scoresByUser[s.user_id] = []
    scoresByUser[s.user_id].push(s.score)
  }

  const potentialWinners = []
  for (const [userId, userScores] of Object.entries(scoresByUser)) {
    const matched = matchScores(userScores, draw.numbers)
    if (matched.length >= 3) {
      potentialWinners.push({ userId, tier: matched.length, matched })
    }
  }

  // Calculate per-winner prize amounts
  const tierCounts = { 5: 0, 4: 0, 3: 0 }
  for (const w of potentialWinners) {
    const t = Math.min(w.tier, 5)
    tierCounts[t] = (tierCounts[t] || 0) + 1
  }

  const tierAmounts = {
    5: tierCounts[5] > 0 ? draw.jackpot_amount / tierCounts[5] : 0,
    4: tierCounts[4] > 0 ? draw.tier2_amount / tierCounts[4] : 0,
    3: tierCounts[3] > 0 ? draw.tier3_amount / tierCounts[3] : 0,
  }

  // Upsert winners
  const winnerRows = potentialWinners.map(w => ({
    draw_id: draw.id,
    user_id: w.userId,
    tier: Math.min(w.tier, 5),
    matched_numbers: w.matched,
    prize_amount: parseFloat((tierAmounts[Math.min(w.tier, 5)] || 0).toFixed(2)),
  }))

  if (winnerRows.length > 0) {
    await supabaseAdmin
      .from('winners')
      .upsert(winnerRows, { onConflict: 'draw_id,user_id' })
  }

  // Handle jackpot rollover if no 5-match winner
  if (tierCounts[5] === 0) {
    await supabaseAdmin
      .from('draws')
      .update({ jackpot_rollover: draw.jackpot_amount })
      .eq('id', draw.id)
  }

  return winnerRows
}

export async function publishDraw(drawId) {
  const { data, error } = await supabaseAdmin
    .from('draws')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', drawId)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getDrawHistory(limit = 12) {
  const { data, error } = await supabaseAdmin
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getDrawWithWinners(drawId) {
  const { data: draw, error } = await supabaseAdmin
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single()
  if (error) throw new Error(error.message)

  const { data: winners } = await supabaseAdmin
    .from('winners')
    .select('*, users(full_name, email)')
    .eq('draw_id', drawId)

  return { draw, winners: winners || [] }
}

export async function getUserWinnings(userId) {
  const { data, error } = await supabaseAdmin
    .from('winners')
    .select('*, draws(draw_month, numbers, status)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}
