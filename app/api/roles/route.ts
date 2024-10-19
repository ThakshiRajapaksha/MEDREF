import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all roles
    const roles = await prisma.role.findMany();

    // Log the roles for debugging purposes
    console.log('Roles fetched successfully:', roles);

    // Return roles with a success message
    return NextResponse.json(
      { success: true, message: 'List of roles', data: roles },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error in /api/roles:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch roles',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
