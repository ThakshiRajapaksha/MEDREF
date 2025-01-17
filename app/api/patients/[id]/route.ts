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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  try {
    const patientId = parseInt(id, 10);
    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const { test_type, lab, updatedById, doctorId } = body;

    const userId = parseInt(updatedById, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid updatedById' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User with provided updatedById not found' },
        { status: 400 }
      );
    }

    // Update patient record
    const updateData: any = {
      first_name: body.first_name,
      last_name: body.last_name,
      age: body.age,
      gender: body.gender,
      contact: body.contact,
      medicalHistory: body.medicalHistory,
      updatedBy: { connect: { id: userId } },
    };

    if (doctorId) {
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

      const doctorid = parseInt(doctorId, 10);
      if (isNaN(doctorid)) {
        return NextResponse.json(
          { success: false, message: 'Invalid doctor ID' },
          { status: 400 }
        );
      }

      updateData.referrals = {
        create: {
          test: { connect: { id: testType.id } },
          lab: { connect: { id: labEntity.id } },
          doctor: { connect: { id: doctorid } },
        },
      };
    }

    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: updateData,
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
