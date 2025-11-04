import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const review = await prisma.platformReview.findUnique({
            where: { userId: session.user.id },
        });

        if (!review) {
            return new NextResponse('No review found for this user.', { status: 404 });
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('[PLATFORM_REVIEW_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { rating, comment } = body;

        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return new NextResponse('A rating between 1 and 5 is required.', { status: 400 });
        }

        const platformReview = await prisma.platformReview.upsert({
            where: {
                userId: session.user.id,
            },
            update: {
                rating,
                comment,
            },
            create: {
                userId: session.user.id,
                rating,
                comment,
            },
        });

        return NextResponse.json(platformReview, { status: 200 });
    } catch (error) {
        console.error('[PLATFORM_REVIEW_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}