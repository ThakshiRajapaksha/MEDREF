import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Corrected import path to use relative path to lib/prisma.ts

interface Patient {
  first_name: string;
  last_name: string;
}

interface TestType {
  name: string;
}

interface Lab {
  name: string;
}

interface Referral {
  id: number;
  patient: Patient;
  test_type: TestType;
  lab_name: Lab;
}

export async function GET() {
  try {
    // Fetch referrals, including related test and lab data
    const referrals = await prisma.referral.findMany({
      include: {
        patient: true, // Include patient information (first_name, last_name)
        test: {
          select: {
            name: true, // Fetch the name of the test from TestType
          },
        },
        lab: {
          select: {
            name: true, // Fetch the name of the lab from Lab
          },
        },
      },
    });

    // Return the response with the correct fields
    return NextResponse.json({
      success: true,
      referrals: referrals.map((referral: { id: any; patient: { first_name: any; last_name: any; }; test: { name: any; }; lab: { name: any; }; }) => ({
        id: referral.id,
        patient: {
          first_name: referral.patient.first_name,
          last_name: referral.patient.last_name,
        },
        test_type: referral.test.name, // Access test type name
        lab_name: referral.lab.name,  // Access lab name
      })),
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching referrals',
    });
  }
}
