import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '../../../../lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const rawRefreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!rawRefreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is missing' },
        { status: 401 }
      );
    }

    const tokenHash = hashToken(rawRefreshToken);
    const now = new Date();

    // 1. Check if token exists in database
    const existingToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!existingToken) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // 2. Token reuse detection: if token was already revoked, potential theft detected!
    // Revoke all active refresh tokens for this user immediately.
    if (existingToken.revokedAt !== null) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: existingToken.userId,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });

      const response = NextResponse.json(
        { error: 'Token has been revoked. Security violation detected.' },
        { status: 401 }
      );

      // Clear cookies
      response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });

      return response;
    }

    // 3. Check if token is expired
    if (existingToken.expiresAt < now) {
      return NextResponse.json(
        { error: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // 4. Token is valid -> Rotate token (revoke current token and issue new pair)
    const newRawRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRawRefreshToken);
    const newRefreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_MAX_AGE * 1000);

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { revokedAt: now },
      }),
      prisma.refreshToken.create({
        data: {
          userId: existingToken.userId,
          tokenHash: newTokenHash,
          expiresAt: newRefreshExpiresAt,
        },
      }),
    ]);

    // Issue new access token
    const newAccessToken = signAccessToken({
      id: existingToken.user.id,
      role: existingToken.user.role,
      email: existingToken.user.email,
      phone: existingToken.user.phone,
    });

    const isProduction = process.env.NODE_ENV === 'production';

    const response = NextResponse.json(
      { message: 'Token refreshed successfully' },
      { status: 200 }
    );

    response.cookies.set(ACCESS_TOKEN_COOKIE, newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, newRawRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
