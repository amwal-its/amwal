import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;

    // Find user by either email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    // Ensure you set JWT_SECRET in your .env file
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_please_change_in_production';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        phone: user.phone 
      }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );

    // Return token and user (excluding passwordHash)
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'Login successful', 
        token, 
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
