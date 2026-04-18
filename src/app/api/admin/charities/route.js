import { supabaseAdmin } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api'

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('charities')
      .select('*')
      .order('name')
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function POST(request) {
  try {
    const { name, description, logoUrl } = await request.json()
    if (!name) return apiError('name is required')

    const { data, error } = await supabaseAdmin
      .from('charities')
      .insert({ name, description, logo_url: logoUrl })
      .select()
      .single()
    if (error) return apiError(error.message)
    return apiSuccess(data, 201)
  } catch (err) {
    return apiError(err.message)
  }
}

export async function PATCH(request) {
  try {
    const { id, name, description, active } = await request.json()
    if (!id) return apiError('id is required')

    const updates = {}
    if (name !== undefined) updates.name = name
    if (description !== undefined) updates.description = description
    if (active !== undefined) updates.active = active

    const { data, error } = await supabaseAdmin
      .from('charities')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return apiError(error.message)
    return apiSuccess(data)
  } catch (err) {
    return apiError(err.message)
  }
}
