import { loginUser } from '@/services/auth.service'
import { apiSuccess, apiError } from '@/lib/api'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) return apiError('Email and password are required')

    const result = await loginUser({ email, password })

    const response = apiSuccess(result)
    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch (err) {
    return apiError(err.message, 401)
  }
}
