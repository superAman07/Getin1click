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

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const status = searchParams.get('status');
    const searchTerm = searchParams.get('search');

    try {
        const leads = await prisma.lead.findMany({
            where: {
                ...(serviceId ? { serviceId } : {}),
                ...(status && status !== 'ALL' ? { status } : {}),
                ...(searchTerm ? {
                    OR: [
                        { title: { contains: searchTerm, mode: 'insensitive' } },
                        { description: { contains: searchTerm, mode: 'insensitive' } },
                    ]
                } : {})
            },
            include: {
                service: { select: { name: true } },
                customer: { select: { name: true, email: true , phoneNumber: true } },
                assignments: {
                    include: {
                        professional: { 
                            select: { 
                                id: true,
                                name: true, 
                                email: true,
                                professionalProfile: {
                                    select: {
                                        credits: true,
                                        phoneNumber: true,
                                        companyName: true
                                    }
                                } 
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(leads);
    } catch (error) {
        console.error("Error fetching leads for admin:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}