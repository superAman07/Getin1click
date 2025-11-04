import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'PROFESSIONAL') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        status: 'SUCCESS', // Only show successful transactions
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        bundle: {
          select: {
            name: true,
            credits: true,
          },
        },
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}