import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const session = await getServerSession(authOptions);
    const notificationId = id;

    if (!session?.user?.id || session.user.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        await prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId: session.user.id,
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}