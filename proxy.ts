import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * PENTING: proxy berjalan di Edge Runtime, sehingga TIDAK bisa
 * memakai library `jsonwebtoken` (butuh Node.js crypto module).
 * Gunakan `jose` yang kompatibel Edge Runtime untuk verifikasi token.
 *
 * Secret harus dalam bentuk Uint8Array untuk `jose`.
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_please_change_in_production'
);

interface RouteRule {
  prefix: string;
  roles: string[];
}

// Daftar prefix route yang wajib diautentikasi + role yang diizinkan.
// Route di luar daftar ini dianggap publik (tidak diperiksa proxy).
const PROTECTED_ROUTES: RouteRule[] = [
  { prefix: '/dashboard/admin', roles: ['ADMIN'] },
  { prefix: '/api/admin', roles: ['ADMIN'] },
  { prefix: '/dashboard/nadzir', roles: ['NADZIR'] },
  { prefix: '/api/nadzir', roles: ['NADZIR'] },
  { prefix: '/dashboard/petugas', roles: ['PETUGAS_LAPANGAN'] },
  { prefix: '/api/petugas', roles: ['PETUGAS_LAPANGAN'] },
  { prefix: '/api/wakaf', roles: ['WAKIF', 'NADZIR', 'ADMIN'] },
  { prefix: '/api/zakat', roles: ['WAKIF', 'ADMIN', 'PETUGAS_LAPANGAN'] },
  { prefix: '/api/qurban', roles: ['WAKIF', 'ADMIN', 'PETUGAS_LAPANGAN'] },
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matched = PROTECTED_ROUTES.find((rule) => pathname.startsWith(rule.prefix));
  if (!matched) {
    return NextResponse.next();
  }

  const token = req.cookies.get('amwal_token')?.value;
  if (!token) {
    return denyAccess(req, pathname);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string | undefined;

    if (!role || !matched.roles.includes(role)) {
      return denyAccess(req, pathname);
    }

    // Teruskan identitas user ke Route Handler via request header,
    // supaya API Route tidak perlu verifikasi token dua kali.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', String(payload.userId ?? ''));
    requestHeaders.set('x-user-role', role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    // Token invalid/expired
    return denyAccess(req, pathname);
  }
}

function denyAccess(req: NextRequest, pathname: string) {
  // Untuk request API, balas JSON 401 (konsisten dgn format error project)
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Untuk halaman dashboard, redirect ke login
  const loginUrl = new URL('/login', req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/nadzir/:path*',
    '/api/petugas/:path*',
    '/api/wakaf/:path*',
    '/api/zakat/:path*',
    '/api/qurban/:path*',
  ],
};
