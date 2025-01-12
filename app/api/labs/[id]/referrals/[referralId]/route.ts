import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string; referralId: string } } // Corrected dynamic route param keys
) {
  const { id: labId, referralId } = await context.params; // Access params directly

  const labIdInt = parseInt(labId); // Parse the lab ID
  const referralIdInt = parseInt(referralId); // Parse the referral ID

  if (isNaN(labIdInt) || isNaN(referralIdInt)) {
    return NextResponse.json(
      { success: false, message: 'Invalid lab ID or referral ID' },
      { status: 400 }
    );
  }

  try {
    // Fetch the referral by its ID and lab ID
    const referral = await prisma.referral.findFirst({
      where: {
        id: referralIdInt,
        labId: labIdInt,
      },
      include: {
        patient: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        test: {
          select: {
            name: true,
          },
        },
        doctor: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    // If the referral doesn't exist
    if (!referral) {
      return NextResponse.json(
        { success: false, message: 'Referral not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error('Error fetching referral:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching referral data' },
      { status: 500 }
    );
  }
}
