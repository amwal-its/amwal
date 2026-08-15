import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_please_change_in_production'
);

export interface SessionPayload {
  userId: string;
  email?: string;
  phone?: string;
  role: 'WAKIF' | 'NADZIR' | 'ADMIN' | 'PETUGAS_LAPANGAN';
}

/**
 * Membaca & memverifikasi session dari httpOnly cookie `amwal_token`.
 * Dipakai di Server Component atau API Route yang TIDAK tercakup
 * matcher middleware.ts, atau saat butuh detail payload penuh
 * (middleware hanya meneruskan userId & role via header).
 *
 * Contoh pemakaian di Server Component:
 *   const session = await getSession();
 *   if (!session) redirect('/login');
 *
 * Contoh pemakaian di API Route (sebagai lapisan verifikasi tambahan):
 *   const session = await getSession();
 *   if (!session || session.role !== 'ADMIN') {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('amwal_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
