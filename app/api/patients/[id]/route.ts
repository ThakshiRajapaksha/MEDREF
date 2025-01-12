import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Readable } from 'stream';
import formidable from 'formidable';
import fs from 'fs';

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

// Configure formidable
const form = formidable({
  multiples: false,
  uploadDir: './uploads/temp', // Directory to store uploaded files
  keepExtensions: true, // Preserve file extensions
});

if (!fs.existsSync('./uploads/temp')) {
  fs.mkdirSync('./uploads/temp', { recursive: true });
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: 'ID is required' },
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
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const reqStream = Readable.from(buffer);

    const headers = {
      'content-length': buffer.length,
      ...Object.fromEntries(request.headers.entries()),
    };
    (reqStream as any).headers = headers;

    // Parse the form data
    const { files } = await new Promise<{ files: any }>((resolve, reject) => {
      form.parse(reqStream as any, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ files });
      });
    });

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
        {
          success: false,
          message: 'Invalid file type. Only PDF files are allowed.',
        },
        { status: 400 }
      );
    }

    const tempPath = uploadedFile.filepath; // Path to the uploaded file
    const fileName = uploadedFile.originalFilename; // Original file name

    console.log('File saved at path:', tempPath);
    console.log('File name:', fileName);

    // Save the file path and name to the database
    await prisma.referral.update({
      where: { id: parsedId },
      data: {
        status: 'Completed', // Update status or any other fields as needed
        filePath: tempPath, // Save the file path
        test_report_filename: fileName, // Save the file name
      },
    });

    return NextResponse.json({
      success: true,
      message: 'File path and name saved to the database successfully.',
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing file upload.' },
      { status: 500 }
    );
  }
}
