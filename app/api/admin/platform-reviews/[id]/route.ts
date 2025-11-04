import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

// Update a review (e.g., toggle isFeatured)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { id } = params;
        const body = await request.json();
        const { isFeatured } = body;

        if (typeof isFeatured !== 'boolean') {
            return new NextResponse('Invalid request body', { status: 400 });
        }

        const updatedReview = await prisma.platformReview.update({
            where: { id },
            data: { isFeatured },
        });

        return NextResponse.json(updatedReview);
    } catch (error) {
        console.error('[ADMIN_REVIEW_PUT]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Delete a review
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { id } = params;
        await prisma.platformReview.delete({
            where: { id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[ADMIN_REVIEW_DELETE]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}