import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; 
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Referral ID is required.' },
      { status: 400 }
    );
  }

  try {
    const referral = await prisma.referral.findUnique({
      where: { id: parseInt(id, 10) },
      select: { filePath: true, test_report_filename: true },
    });

    if (!referral || !referral.filePath) {
      return NextResponse.json(
        { success: false, message: 'PDF file not found.' },
        { status: 404 }
      );
    }

    const fileFullPath = path.resolve(referral.filePath);

    if (!fs.existsSync(fileFullPath)) {
      return NextResponse.json(
        { success: false, message: 'File does not exist on the server.' },
        { status: 404 }
      );
    }

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
      { success: false, message: 'Internal server error.' },
      { status: 500 }
    );
  }
}
