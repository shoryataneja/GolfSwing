import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/api/auth/login', '/api/auth/signup', '/api/charity']

export async function middleware(request) {
  const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith('/api/auth/'))
  if (isPublic) return NextResponse.next()

  const token = request.cookies.get('token')?.value
  const payload = token ? await verifyToken(token) : null

  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin-only routes
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && payload.role !== 'admin') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.sub)
  requestHeaders.set('x-user-role', payload.role)
  requestHeaders.set('x-user-email', payload.email)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/scores/:path*', '/api/subscription/:path*', '/api/draw/:path*', '/api/winners/:path*', '/api/admin/:path*', '/api/user/:path*', '/api/charity/select'],
}
