import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal(''))
    .transform(e => e === '' ? undefined : e),
  phone: z.string().min(8, 'Phone must be at least 8 digits').optional().or(z.literal(''))
    .transform(p => p === '' ? undefined : p),
  role: z.enum(['WAKIF', 'NADZIR']).optional().default('WAKIF'),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required',
  path: ['email'], // attach error to email field generally
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, password, email, phone, role } = parsed.data;

    // Check if user already exists
    if (email) {
      const existingEmailUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingEmailUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
    }

    if (phone) {
      const existingPhoneUser = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhoneUser) {
        return NextResponse.json(
          { error: 'User with this phone number already exists' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { message: 'User registered successfully', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
