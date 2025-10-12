import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const customers = await prisma.user.findMany({
            where: { role: UserRole.CUSTOMER },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                createdAt: true,
                _count: {
                    select: { postedLeads: true },
                },
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("Error fetching customers:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}