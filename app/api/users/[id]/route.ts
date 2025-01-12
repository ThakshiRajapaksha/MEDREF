import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the import path if needed

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Await context.params.id to resolve it properly
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'User ID is missing' },
        { status: 400 }
      );
    }

    // Convert ID to a number for database query
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: numericId },
      include: { role: true }, // Include role if needed
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error fetching user data:', error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
