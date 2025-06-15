import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';
import { Knock } from '@knocklabs/node';

const knock = new Knock(process.env.NEXT_SECRET_KNOCK_API_KEY);

interface ReferralResponse {
  id: number;
  patient: {
    patientId: number;
    first_name: string;
    last_name: string;
    medicalHistory?: string | null;
  };
  test_type: string;
  lab_name: string;
  user: {
    first_name: string | null;
    last_name: string | null;
  };
  status: string;
  illness?: string | null;
  allergies?: string | null;
}

// GET: Fetch referral by ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'ID is required' },
      { status: 400 }
    );
  }

  try {
    const referral = await prisma.referral.findUnique({
      where: { id: parseInt(id) },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            medicalHistory: true,
          },
        },
        test: { select: { name: true } },
        lab: { select: { name: true } },
        doctor: { select: { first_name: true, last_name: true } },
      },
    });

    if (!referral) {
      return NextResponse.json(
        { success: false, message: 'Referral not found' },
        { status: 404 }
      );
    }

    const formattedReferral: ReferralResponse = {
      id: referral.id,
      patient: {
        patientId: referral.patient.id,
        first_name: referral.patient.first_name,
        last_name: referral.patient.last_name,
        medicalHistory: referral.patient.medicalHistory || null,
      },
      test_type: referral.test.name,
      lab_name: referral.lab.name,
      user: {
        first_name: referral.doctor.first_name,
        last_name: referral.doctor.last_name,
      },
      status: referral.status,
      illness: referral.illness || null,
      allergies: referral.allergies || null,
    };

    return NextResponse.json({ success: true, referral: formattedReferral });
  } catch (error) {
    console.error('Error fetching referral:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching referral data' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Referral ID is required' },
      { status: 400 }
    );
  }

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid referral ID' },
      { status: 400 }
    );
  }

  try {
    // Handle the incoming form data (file and other fields)
    const form = formidable({
      multiples: false,
      uploadDir: './uploads/temp',
      keepExtensions: true,
    });

    if (!fs.existsSync('./uploads/temp')) {
      fs.mkdirSync('./uploads/temp', { recursive: true });
    }

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const reqStream = Readable.from(buffer);

    const headers = {
      'content-length': buffer.length,
      ...Object.fromEntries(request.headers.entries()),
    };
    (reqStream as any).headers = headers;

    // Parse the incoming form data
    const { fields, files } = await new Promise<{ fields: any; files: any }>(
      (resolve, reject) => {
        form.parse(reqStream as any, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      }
    );

    // Normalize fields (convert arrays to strings if necessary)
    for (const key in fields) {
      if (Array.isArray(fields[key])) {
        fields[key] = fields[key][0]; // Take the first element of the array
      }
    }

    const { role, illness, allergies, referral_status } = fields;

    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role is required' },
        { status: 400 }
      );
    }

    let updatedReferral;

    if (role === 'doctor') {
      const updatedReferral = await prisma.referral.update({
        where: { id: parsedId },
        data: {
          illness: illness || undefined,
          allergies: allergies || undefined,
          status: referral_status || 'Pending',
          updatedAt: new Date(),
        },
      });

      console.log('updatedreferrals:', updatedReferral);

      // Get Lab Technician details
      const labId = updatedReferral.labId;
      console.log('labId:', labId);

      // Trigger notification to the lab technician
      const response = await knock.workflows.trigger('medref-notify', {
        recipients: [{ id: labId.toString() }],
        data: {
          referralid: updatedReferral.id,
        },
      });

      console.log('response:', response);

      return NextResponse.json({
        success: true,
        referral: updatedReferral,
        message: 'Referral updated successfully.',
      });
    }

    if (role === 'labtechnician') {
      const uploadedFile = files?.test_report ? files.test_report[0] : null;
      if (!uploadedFile || !uploadedFile.filepath) {
        return NextResponse.json(
          { success: false, message: 'No file uploaded or invalid file key.' },
          { status: 400 }
        );
      }

      const allowedTypes = ['application/pdf'];
      if (!allowedTypes.includes(uploadedFile.mimetype)) {
        return NextResponse.json(
          { success: false, message: 'Invalid file type.' },
          { status: 400 }
        );
      }

      const tempPath = uploadedFile.filepath;

      updatedReferral = await prisma.referral.update({
        where: { id: parsedId },
        data: {
          status: 'Completed',
          test_report_filename: uploadedFile.originalFilename,
          filePath: tempPath,
        },
      });

      const doctorId = updatedReferral.doctorId;

      // Trigger notification to the doctor
      await knock.workflows.trigger('medref-notify', {
        recipients: [{ id: doctorId.toString() }],
        data: {
          referralid: updatedReferral.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Referral updated with test report successfully.',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid role provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating referral data' },
      { status: 500 }
    );
  }
}
