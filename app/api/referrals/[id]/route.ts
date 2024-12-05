import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma'; // Make sure to import Prisma client correctly

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract referralId from URL parameters

  try {
    // Fetch the referral by its ID and include patient details
    const referral = await prisma.referral.findUnique({
      where: {
        id: Number(id), // Ensure the ID is a number
      },
      include: {
        patient: true, // Include related patient details
      },
    });

    // If the referral doesn't exist
    if (!referral) {
      return NextResponse.json({ success: false, message: 'Referral not found' }, { status: 404 });
    }

    // Return the referral and patient data
    return NextResponse.json({ success: true, referral });
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch referral data' }, { status: 500 });
  }
}
