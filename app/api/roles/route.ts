import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all roles
    const roles = await prisma.$queryRaw`SELECT * FROM Role`;

    // Return roles with a success message
    return NextResponse.json(
      { success: true, message: 'List of roles', data: roles },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch roles',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
