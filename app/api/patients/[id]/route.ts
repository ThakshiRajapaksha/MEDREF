import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // No need to await params since it's already available
  const { id } = await params;

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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  // No need to await params since it's already available
  const { id } = params;
  const body = await req.json(); // Get the updated data from the request body

  try {
    const patientId = parseInt(id, 10);
    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const { test_type, lab } = body;

    const testType = await prisma.testType.findFirst({
      where: { name: test_type }, 
    });
    const labEntity = await prisma.lab.findFirst({
      where: { name: lab }, 
    });

    if (!testType || !labEntity) {
      return NextResponse.json(
        { success: false, message: 'Invalid test type or lab' },
        { status: 400 }
      );
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        age: body.age,
        gender: body.gender,
        contact: body.contact,
        medicalHistory: body.medicalHistory,
        referrals: {
          create: {
            test: { connect: { id: testType.id } }, 
            lab: { connect: { id: labEntity.id } }, 
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, patient: updatedPatient },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update patient',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
