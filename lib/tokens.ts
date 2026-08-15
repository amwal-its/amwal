import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const ACCESS_TOKEN_COOKIE = 'amwal_token';
export const REFRESH_TOKEN_COOKIE = 'amwal_refresh';

export const ACCESS_TOKEN_MAX_AGE = 20 * 60; // 20 minutes (1200 seconds)
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';

export interface TokenUser {
  id: string;
  role: string;
  email?: string | null;
  phone?: string | null;
}

export function signAccessToken(user: TokenUser): string {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
    },
    JWT_SECRET,
    { expiresIn: '20m' }
  );
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
