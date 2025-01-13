import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteContext = {
  params: {
    id: string;
    referralId: string;
  };
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id: labId, referralId } = context.params;
  const labIdInt = parseInt(labId, 10);
  const referralIdInt = parseInt(referralId, 10);

  if (isNaN(labIdInt) || isNaN(referralIdInt)) {
    return NextResponse.json(
      { success: false, message: 'Invalid lab ID or referral ID' },
      { status: 400 }
    );
  }

  try {
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

    if (!referral) {
      return NextResponse.json(
        { success: false, message: 'Referral not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, referral });
  } catch (error) {
    console.error('Error fetching referral:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching referral data' },
      { status: 500 }
    );
  }
}
