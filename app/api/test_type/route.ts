import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Update this path based on your project setup

export async function GET() {
  try {
    // Fetch test types and their associated labs from the database
    const testTypes = await prisma.testType.findMany({
      include: {
        lab: true, // Assuming there is a relation called 'lab' in your Prisma schema
      },
    });

    return NextResponse.json({ success: true, testTypes });
  } catch (error) {
    console.error('Error fetching test types:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch test types.' },
      { status: 500 }
    );
  }
}
