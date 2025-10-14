import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== UserRole.PROFESSIONAL) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to most recent 20
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching professional notifications:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}