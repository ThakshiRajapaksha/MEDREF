import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { promises } from 'dns';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const labId = parseInt(id);

  if (isNaN(labId)) {
    return NextResponse.json(
      { success: false, message: 'Invalid lab ID' },
      { status: 400 }
    );
  }

  try {
    // Fetch referrals for the given lab ID
    const referrals = await prisma.referral.findMany({
      where: {
        labId: labId,
      },
      include: {
        patient: true,
        test: true,
        doctor: true,
      },
    });

    return NextResponse.json({
      success: true,
      referrals,
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching referrals' },
      { status: 500 }
    );
  }
}
