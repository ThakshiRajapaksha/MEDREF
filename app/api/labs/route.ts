import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all labs from the database
    const labs = await prisma.lab.findMany({
      include: {
        testtype: true,
      },
    });

    return NextResponse.json({
      success: true,
      labs,
    });
  } catch (error) {
    console.error('Error fetching labs:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching labs' },
      { status: 500 }
    );
  }
}
