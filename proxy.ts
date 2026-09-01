import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_please_change_in_production'
);

interface RouteRule {
  prefix: string;
  roles?: string[];
}

// Routes requiring authentication + optional role authorization
const PROTECTED_ROUTES: RouteRule[] = [
  { prefix: '/profile' },
  { prefix: '/riwayat' },
  { prefix: '/backoffice', roles: ['ADMIN', 'NADZIR', 'PETUGAS_LAPANGAN'] },
  { prefix: '/zakat/bayar' },
  { prefix: '/qurban/bayar' },
  { prefix: '/dashboard/admin', roles: ['ADMIN'] },
  { prefix: '/admin', roles: ['ADMIN', 'PETUGAS_LAPANGAN'] },
  { prefix: '/api/admin', roles: ['ADMIN', 'PETUGAS_LAPANGAN'] },
  { prefix: '/dashboard/nadzir', roles: ['NADZIR'] },
  { prefix: '/api/nadzir', roles: ['NADZIR'] },
  { prefix: '/dashboard/petugas', roles: ['PETUGAS_LAPANGAN'] },
  { prefix: '/api/petugas', roles: ['PETUGAS_LAPANGAN'] },
  { prefix: '/api/wakaf/create', roles: ['NADZIR', 'ADMIN'] },
];

const AUTH_ROUTES = ['/login', '/register'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('amwal_token')?.value;

  let session: { userId: string; role?: string; email?: string; phone?: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      session = payload as unknown as { userId: string; role?: string; email?: string; phone?: string };
    } catch {
      session = null;
    }
  }

  // 1. If user is logged in and visits /login or /register -> redirect to /dashboard
  if (session && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 2. Check if route is protected
  const matchedRule = PROTECTED_ROUTES.find((rule) => pathname.startsWith(rule.prefix));

  if (matchedRule) {
    if (!session) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      const res = NextResponse.redirect(loginUrl);
      if (token) {
        res.cookies.set('amwal_token', '', { path: '/', maxAge: 0 });
      }
      return res;
    }

    // Role check if rule has specified roles
    if (matchedRule.roles && matchedRule.roles.length > 0) {
      if (!session.role || !matchedRule.roles.includes(session.role)) {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 });
        }
        const unauthUrl = new URL('/dashboard?error=unauthorized', req.url);
        return NextResponse.redirect(unauthUrl);
      }
    }
  }

  // Forward session identity headers
  const requestHeaders = new Headers(req.headers);
  if (session) {
    requestHeaders.set('x-user-id', String(session.userId ?? ''));
    if (session.role) requestHeaders.set('x-user-role', session.role);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile/:path*',
    '/riwayat/:path*',
    '/backoffice/:path*',
    '/zakat/bayar/:path*',
    '/qurban/bayar/:path*',
    '/dashboard/admin/:path*',
    '/admin/:path*',
    '/dashboard/nadzir/:path*',
    '/dashboard/petugas/:path*',
    '/api/admin/:path*',
    '/api/nadzir/:path*',
    '/api/petugas/:path*',
  ],
};
