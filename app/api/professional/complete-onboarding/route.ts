import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { onboardingComplete: true },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}