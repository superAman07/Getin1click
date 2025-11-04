import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const searchTerm = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'ALL';
    const skip = (page - 1) * limit;

    try {
        const where: Prisma.PlatformReviewWhereInput = {
            AND: [
                searchTerm ? {
                    OR: [
                        { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
                        { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
                        { comment: { contains: searchTerm, mode: 'insensitive' } },
                    ],
                } : {},
                filter === 'FEATURED' ? { isFeatured: true } : {},
                filter.endsWith('_STARS') ? { rating: parseInt(filter.charAt(0)) } : {},
                filter === '1_STAR' ? { rating: 1 } : {},
            ],
        };

        const [reviews, totalReviews] = await prisma.$transaction([
            prisma.platformReview.findMany({
                where,
                include: {
                    user: {
                        select: { name: true, email: true, role: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.platformReview.count({ where }),
        ]);

        return NextResponse.json({
            reviews,
            totalPages: Math.ceil(totalReviews / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('[ADMIN_REVIEWS_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}