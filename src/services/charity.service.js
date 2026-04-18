import { supabaseAdmin } from '@/lib/db'
import { getCurrentMonth } from '@/lib/utils'

export async function getCharities() {
  const { data, error } = await supabaseAdmin
    .from('charities')
    .select('*')
    .eq('active', true)
    .order('name')
  if (error) throw new Error(error.message)
  return data || []
}

export async function selectCharity(userId, charityId, charityPct = 10) {
  if (charityPct < 10 || charityPct > 100) throw new Error('Charity percentage must be between 10 and 100')

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ charity_id: charityId, charity_pct: charityPct })
    .eq('id', userId)
    .select('charity_id, charity_pct')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function recordDonation(userId, charityId, subscriptionAmount, charityPct) {
  const donationAmount = parseFloat(((subscriptionAmount * charityPct) / 100).toFixed(2))
  const month = getCurrentMonth()

  const { data, error } = await supabaseAdmin
    .from('donations')
    .insert({ user_id: userId, charity_id: charityId, amount: donationAmount, month })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getUserDonations(userId) {
  const { data, error } = await supabaseAdmin
    .from('donations')
    .select('*, charities(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getTotalDonationsByCharity() {
  const { data, error } = await supabaseAdmin
    .from('donations')
    .select('charity_id, amount, charities(name)')
  if (error) throw new Error(error.message)

  const totals = {}
  for (const d of data || []) {
    const key = d.charity_id
    if (!totals[key]) totals[key] = { charity_id: key, name: d.charities?.name, total: 0 }
    totals[key].total += parseFloat(d.amount)
  }
  return Object.values(totals).sort((a, b) => b.total - a.total)
}
