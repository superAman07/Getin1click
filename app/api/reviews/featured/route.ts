import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const featuredReviews = await prisma.platformReview.findMany({
            where: {
                isFeatured: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        name: true,
                        role: true, 
                        professionalProfile: {
                            select: {
                                profilePictureUrl: true,
                            },
                        },
                    },
                },
            },
            take: 10,
        });

        const response = featuredReviews.map(review => ({
            ...review,
            user: {
                name: review.user.name,
                role: review.user.role,
                image: review.user.professionalProfile?.profilePictureUrl || null,
            }
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error('[FEATURED_REVIEWS_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}