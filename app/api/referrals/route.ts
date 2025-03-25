import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

interface ReferralResponse {
  id: number;
  patient: {
    first_name: string;
    last_name: string;
  };
  test_type: string;
  lab_name: string;
  user: {
    first_name: string | null;
    last_name: string;
  };
  status: string;
  illness?: string | null;
  allergies?: string | null;
  test_report_filename?: string | null;
  filePath?: string | null;
  urgency: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId'); // Extract the doctorId from query parameters

    if (!doctorId) {
      return NextResponse.json(
        {
          success: false,
          message: 'doctorId query parameter is required.',
        },
        { status: 400 }
      );
    }

    // Fetch referrals filtered by doctorId
    const referrals = await prisma.referral.findMany({
      where: {
        doctorId: parseInt(doctorId), // Ensure the doctorId is parsed as an integer
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
        lab: {
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

    const formattedReferrals: ReferralResponse[] = referrals.map(
      (referral) => ({
        id: referral.id,
        patient: {
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
        test_report_filename: referral.test_report_filename || null,
        filePath: referral.filePath || null,
        urgency: referral.urgency,
      })
    );

    return NextResponse.json({
      success: true,
      referrals: formattedReferrals,
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching referrals',
      },
      { status: 500 }
    );
  }
}
