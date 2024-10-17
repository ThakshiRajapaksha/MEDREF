import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Define the expected shape of the request body
interface CreateUserBody {
  first_name: string | null;
  last_name: string;
  mobile: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    // Extract data from the request body, with proper typing
    const {
      first_name,
      last_name,
      mobile,
      email,
      password,
      role,
    }: CreateUserBody = await request.json();

    const existingRole = await prisma.role.findUnique({
      where: {
        name: role, // Look up the role by its name
      },
    });

    if (!existingRole) {
      return NextResponse.json(
        { success: false, message: 'Invalid role provided' },
        { status: 400 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        mobile,
        email,
        password: hashedPassword,
        roleId: existingRole.id,
      },
    });

    // Respond with success
    return NextResponse.json(
      { success: true, message: 'User created successfully!', data: user },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Type check: Check if error is an instance of Error
    if (error instanceof Error) {
      // Now you can safely access error.message
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create user',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Fallback for unknown errors
    return NextResponse.json(
      { success: false, message: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch all users and include their roles in the response
    const users = await prisma.user.findMany({
      include: {
        role: true, // Include role information in the user data
      },
    });

    // Return users with a success message
    return NextResponse.json(
      { success: true, message: 'List of users', data: users },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Handle known error
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch users',
          error: error.message,
        },
        { status: 500 }
      );
    }

    // Fallback for unknown errors
    return NextResponse.json(
      { success: false, message: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
