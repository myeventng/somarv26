// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Use Better Auth's signup
    try {
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: name || email.split('@')[0],
        },
      });

      // Better Auth returns the user directly, not wrapped in data/error
      const userId = result.user?.id;

      if (!userId) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      // Update user role if provided
      if (role) {
        await prisma.user.update({
          where: { id: userId },
          data: { role },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: result.user,
      });
    } catch (authError: unknown) {
      // Handle Better Auth specific errors
      const errorMessage = authError instanceof Error ? authError.message : 'Failed to create user';
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}