import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST endpoint to create a patient
export async function POST(req: Request) {
  try {
    const {
      first_name,
      last_name,
      age,
      gender,
      contact,
      medicalHistory,
      adminId,
    } = await req.json();

    if (!first_name || !last_name || !age || !gender || !contact || !adminId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        first_name,
        last_name,
        age: parseInt(age),
        gender,
        contact,
        medicalHistory: medicalHistory || '',
        createdById: adminId,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Patient registered successfully!', patient },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error registering patient:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to register patient',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all patients
export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, patients }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching patients:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch patients',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
