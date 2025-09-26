import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json({message: "Missing email or password"}, { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return NextResponse.json({message: "User with this email already exists, Please Login!"}, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'CUSTOMER',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}