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
        const professionals = await prisma.user.findMany({
            where: { role: UserRole.PROFESSIONAL },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                onboardingComplete: true,
                createdAt: true,
                professionalProfile: {
                    select: {
                        credits: true,
                        companyName: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(professionals);
    } catch (error) {
        console.error("Error fetching professionals:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}