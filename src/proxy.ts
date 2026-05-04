import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  if (pathname === '/login') {
    if (session) {
      const role = (session.user as { role?: string }).role
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin/dashboard' : '/dashboard', req.url))
    }
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const role = (session.user as { role?: string }).role

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
