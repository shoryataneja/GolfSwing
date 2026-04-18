import { supabaseAdmin } from '@/lib/db'

export async function getScores(userId) {
  const { data, error } = await supabaseAdmin
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .order('score_date', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function addScore(userId, { score, scoreDate }) {
  // Fetch current scores ordered oldest first
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('scores')
    .select('id, score_date')
    .eq('user_id', userId)
    .order('score_date', { ascending: true })
  if (fetchError) throw new Error(fetchError.message)

  // Check duplicate date
  const duplicate = existing.find(s => s.score_date === scoreDate)
  if (duplicate) throw new Error('A score for this date already exists')

  // If already 5 scores, delete the oldest
  if (existing.length >= 5) {
    const oldest = existing[0]
    const { error: deleteError } = await supabaseAdmin
      .from('scores')
      .delete()
      .eq('id', oldest.id)
    if (deleteError) throw new Error(deleteError.message)
  }

  const { data, error } = await supabaseAdmin
    .from('scores')
    .insert({ user_id: userId, score, score_date: scoreDate })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteScore(userId, scoreId) {
  const { error } = await supabaseAdmin
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', userId)
  if (error) throw new Error(error.message)
}
