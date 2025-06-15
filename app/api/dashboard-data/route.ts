import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust this based on your setup

export async function GET() {
  try {
    // Fetch general counts
    const patients = await prisma.patient.count();
    const referrals = await prisma.referral.count();
    const tests = await prisma.testType.count();
    const labs = await prisma.lab.count();

    // Fetch completed and pending referral counts
    const completed = await prisma.referral.count({
      where: { status: 'completed' },
    });

    const pending = await prisma.referral.count({
      where: { status: 'pending' },
    });

    // Fetch referrals grouped by test type
    const referralsByTestType = await prisma.referral.groupBy({
      by: ['testId'],
      _count: { id: true },
      orderBy: { testId: 'asc' },
    });

    // Fetch test type names
    const testTypeNames = await prisma.testType.findMany({
      select: { id: true, name: true },
    });

    const testTypeData = referralsByTestType.map((referral) => {
      const testType = testTypeNames.find((t) => t.id === referral.testId);
      return {
        testType: testType?.name || 'Unknown',
        count: referral._count.id,
      };
    });

    // Fetch patient registrations grouped by year and gender from createdAt
    const yearlyRegistrations = await prisma.patient.findMany({
      select: {
        gender: true,
        createdAt: true,
        age: true,
      },
    });

    // Process data into yearly counts by gender
    const yearlyData = yearlyRegistrations.reduce(
      (acc, patient) => {
        const year = new Date(patient.createdAt).getFullYear();
        const gender = patient.gender.toLowerCase(); // Ensure lowercase comparison

        if (!acc[year]) acc[year] = { Male: 0, Female: 0 };

        if (gender === 'male') acc[year].Male += 1;
        else if (gender === 'female') acc[year].Female += 1;

        return acc;
      },
      {} as Record<string, { Male: number; Female: number }>
    );

    // Extract sorted years and corresponding data for charting
    const years = Object.keys(yearlyData).sort();
    const maleData = years.map((year) => yearlyData[year].Male || 0);
    const femaleData = years.map((year) => yearlyData[year].Female || 0);

    const monthlyAges = yearlyRegistrations.reduce(
      (acc, patient) => {
        const date = new Date(patient.createdAt);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        if (!acc[month]) acc[month] = [];
        acc[month].push(patient.age);

        return acc;
      },
      {} as Record<string, number[]>
    );

    // Extract sorted months and average age per month
    const months = Object.keys(monthlyAges).sort();
    const averageAges = months.map((month) => {
      const ages = monthlyAges[month];
      return ages.length > 0
        ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length)
        : 0;
    });

    return NextResponse.json({
      success: true,
      patients,
      referrals,
      tests,
      labs,
      completed,
      pending,
      testTypeData,
      yearlyData: { years, maleData, femaleData },
      monthlyAgeData: { months, averageAges },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
