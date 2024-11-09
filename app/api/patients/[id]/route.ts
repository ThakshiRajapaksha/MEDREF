import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const patientId = parseInt(id, 10);
    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, patient }, { status: 200 });
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch patient',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Add similar `PUT` and `DELETE` methods if you need to update or delete by ID
