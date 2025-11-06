import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const organicData = await prisma.platformReview.aggregate({
            _avg: { rating: true },
            _count: { id: true },
        });

        const organicRating = organicData._avg.rating || 0;
        const organicCount = organicData._count.id || 0;

        return NextResponse.json({
            organicRating: parseFloat(organicRating.toFixed(2)),
            organicCount,
        });

    } catch (error) {
        console.error('[ADMIN_ORGANIC_TRUST_SCORE_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}