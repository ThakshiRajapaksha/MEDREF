import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/lib/secret';

export async function POST(request: NextRequest) {
  try {
    // Get the request body (email and password)
    const { email, password } = await request.json();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.roleId }, // Payload for the token
      SECRET_KEY!, // Secret key used to sign the JWT
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Respond with the JWT token and user information (excluding password)
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          roleId: user.roleId,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: 'Login failed', error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
