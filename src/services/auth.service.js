import { supabaseAdmin, supabase } from '@/lib/db'
import { signToken } from '@/lib/auth'

export async function signupUser({ email, password, fullName, charityId, charityPct = 10 }) {
  // Create Supabase auth user via admin API
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError) throw new Error(authError.message)

  const userId = authData.user.id

  // Insert into public.users
  const { error: userError } = await supabaseAdmin.from('users').insert({
    id: userId,
    email,
    full_name: fullName,
    charity_id: charityId || null,
    charity_pct: charityPct,
  })
  if (userError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    throw new Error(userError.message)
  }

  const token = await signToken({ sub: userId, email, role: 'user' })
  return { token, user: { id: userId, email, fullName, role: 'user' } }
}

export async function loginUser({ email, password }) {
  // signInWithPassword must use the anon client, not the admin client
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Invalid email or password')

  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, role')
    .eq('id', data.user.id)
    .single()
  if (userError) throw new Error('User not found')

  const token = await signToken({ sub: user.id, email: user.email, role: user.role })
  return { token, user }
}
