import { signupUser } from '@/services/auth.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password, fullName, charityId, charityPct } = body

    if (!email || !password || !fullName) return apiError('email, password, and fullName are required')
    if (password.length < 8) return apiError('Password must be at least 8 characters')

    const result = await signupUser({ email, password, fullName, charityId, charityPct })

    const response = apiSuccess(result, 201)
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    return apiError(err.message)
  }
}
