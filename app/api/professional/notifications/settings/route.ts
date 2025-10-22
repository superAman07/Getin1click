import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'PROFESSIONAL') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        notifyOnNewLead: true,
        notifyOnNewMessage: true,
        notifyOnPayment: true,
        notifyWeeklySummary: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH handler to update settings
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'PROFESSIONAL') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { notifyOnNewLead, notifyOnNewMessage, notifyOnPayment, notifyWeeklySummary } = body;

    await prisma.professionalProfile.update({
      where: { userId: session.user.id },
      data: {
        notifyOnNewLead,
        notifyOnNewMessage,
        notifyOnPayment,
        notifyWeeklySummary,
      },
    });

    return NextResponse.json({ message: 'Settings updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}