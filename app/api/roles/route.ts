import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all roles
    const roles = await prisma.role.findMany();

    // Return roles with a success message
    return NextResponse.json(
      { success: true, message: 'List of roles', data: roles },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching roles:', error); // Log the error for debugging

    // Handle Prisma-specific errors if applicable
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
