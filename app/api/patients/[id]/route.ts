import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET handler to fetch patient details by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // Extract the dynamic route parameter

    const patientId = parseInt(id, 10); // Parse the ID to a number
    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        referrals: true,
        createdBy: true,
      },
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

// PUT handler to update patient details and create a referral
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params; // Extract the dynamic route parameter
    const patientId = parseInt(id, 10); // Convert it to an integer
    if (isNaN(patientId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const data = await req.json();
    const {
      first_name,
      last_name,
      illness,
      allergies,
      test_type, // Expected to be the name of the test
      lab, // Expected to be the name of the lab
      referral_status,
      medical_history,
      doctorId,
    } = data;

    // Ensure doctorId is provided and valid
    if (!doctorId) {
      return NextResponse.json(
        { success: false, message: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    const parsedDoctorId = parseInt(doctorId, 10);
    if (isNaN(parsedDoctorId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid Doctor ID' },
        { status: 400 }
      );
    }

    // Verify the doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: parsedDoctorId },
    });
    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Verify the lab exists by name
    const labRecord = await prisma.lab.findFirst({
      where: { name: lab },
    });
    if (!labRecord) {
      return NextResponse.json(
        { success: false, message: 'Lab not found' },
        { status: 404 }
      );
    }

    // Verify the test type exists by name
    const testExists = await prisma.testType.findFirst({
      where: { name: test_type },
    });
    if (!testExists) {
      return NextResponse.json(
        { success: false, message: 'Invalid test name' },
        { status: 400 }
      );
    }

    // Update the patient details
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        first_name,
        last_name,
        medicalHistory: medical_history,
      },
    });

    // Create a referral
    const createdReferral = await prisma.referral.create({
      data: {
        patient: { connect: { id: patientId } },
        test: { connect: { id: testExists.id } },
        lab: { connect: { id: labRecord.id } },
        status: referral_status,
        illness: illness || null,
        allergies: allergies || null,
        doctor: { connect: { id: parsedDoctorId } },
      },
    });

    return NextResponse.json(
      { success: true, patient: updatedPatient, referral: createdReferral },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating patient data.' },
      { status: 500 }
    );
  }
}
