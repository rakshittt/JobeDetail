import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    console.log('Registration request body:', { ...body, password: '[REDACTED]' });

    const { email, password, name } = body;

    // Validate required fields
    if (!email || !password || !name) {
      console.log('Missing fields:', { email: !!email, password: !!password, name: !!name });
      return NextResponse.json(
        { error: "Missing required fields", details: { email: !email, password: !password, name: !name } },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      console.log('Password too short');
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    try {
      // Check for existing user
      const existing = await prisma.user.findUnique({
        where: { email }
      });

      if (existing) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword
        }
      });

      console.log('User created successfully:', { id: user.id, email: user.email });
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);

      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: "A user with this email already exists" },
            { status: 400 }
          );
        }
      }

      if (dbError instanceof Prisma.PrismaClientInitializationError) {
        console.error('Database connection error:', dbError.message);
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 500 }
        );
      }

      throw dbError;
    }
  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
