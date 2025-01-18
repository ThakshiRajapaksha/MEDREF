import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ labId: string; referralId: string }> }
) {
  const { referralId } = await context.params;

  try {
    // Find the referral by ID
    const referral = await prisma.referral.findUnique({
      where: { id: parseInt(referralId) },
      select: { filePath: true, test_report_filename: true },
    });

    if (!referral || !referral.filePath) {
      return NextResponse.json(
        { success: false, message: 'PDF file not found' },
        { status: 404 }
      );
    }

    const fileFullPath = path.resolve(referral.filePath);

    // Check if the file exists
    if (!fs.existsSync(fileFullPath)) {
      return NextResponse.json(
        { success: false, message: 'File does not exist on the server' },
        { status: 404 }
      );
    }

    // Read the file and send it as a response
    const fileBuffer = fs.readFileSync(fileFullPath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${referral.test_report_filename}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching the PDF file:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
