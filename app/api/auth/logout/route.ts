import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import {
  hashToken,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../../../../lib/tokens';

export async function POST(req: NextRequest) {
  try {
    const rawRefreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

    if (rawRefreshToken) {
      const tokenHash = hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: {
          tokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    // Clear access token cookie
    response.cookies.set(ACCESS_TOKEN_COOKIE, '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    // Clear refresh token cookie
    response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
