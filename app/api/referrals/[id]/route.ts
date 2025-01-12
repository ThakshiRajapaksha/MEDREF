import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// Encryption configuration
const algorithm = 'aes-256-cbc';
const ivLength = 16; // AES block size

const getEncryptionKey = (): Buffer => {
  const rawKey = process.env.ENCRYPTION_KEY || 'default-fallback-key';
  return Buffer.from(rawKey.padEnd(32, '*').slice(0, 32)); // Ensures 32 bytes
};

// Helper functions
const encryptData = (data: Buffer): { encryptedData: Buffer; iv: Buffer } => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(ivLength); // Generate a random IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
  return { encryptedData, iv };
};

const decryptData = (encryptedData: Buffer, iv: Buffer): Buffer => {
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};

// Interfaces
interface FileWithPath {
  filepath: string;
  [key: string]: any; // Allows other properties to be included
}

interface ReferralResponse {
  id: number;
  patient: {
    patientId: number;
    first_name: string;
    last_name: string;
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
  context: { params: { id: string } }
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
        patient: { select: { id: true, first_name: true, last_name: true } },
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

// PUT: Update referral with file upload
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

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

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(uploadedFile.mimetype)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type.' },
        { status: 400 }
      );
    }

    const tempPath = uploadedFile.filepath;
    const fileBuffer = await fs.promises.readFile(tempPath);

    // Encrypt file data
    const { encryptedData, iv } = encryptData(fileBuffer);

    // Update the referral in the database

    await prisma.referral.update({
      where: { id: parsedId },
      data: {
        status: 'Completed',
        test_report_filename: uploadedFile.originalFilename,
        filePath: tempPath,
      },
    });

    // Optionally, delete the temporary file
    await fs.promises.unlink(tempPath);

    return NextResponse.json({
      success: true,
      message:
        'File uploaded, encrypted, and stored in the database successfully.',
    });
  } catch (error) {
    console.error('Error processing file upload:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing file upload.' },
      { status: 500 }
    );
  }
}
