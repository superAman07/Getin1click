import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== UserRole.PROFESSIONAL) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  try {
    // Ensure this notification belongs to this user
    const notification = await prisma.notification.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return new NextResponse('Notification not found', { status: 404 });
    }

    await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(`Error marking notification ${id} as read:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}