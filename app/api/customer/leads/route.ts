import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { NotificationType, UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'CUSTOMER') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    const skip = (page - 1) * limit;

    try {
        const [leads, totalLeads] = await prisma.$transaction([
            prisma.lead.findMany({
                where: { customerId: session.user.id },
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: limit,
                include: {
                    service: {
                        select: { name: true }
                    },
                    _count: {
                        select: { assignments: true }
                    }
                }
            }),
            prisma.lead.count({
                where: { customerId: session.user.id }
            })
        ]);

        const formattedLeads = leads.map(lead => ({
            ...lead,
            _count: {
                purchasedBy: lead._count.assignments
            }
        }));

        return NextResponse.json({ leads: formattedLeads, totalLeads });
    } catch (error) {
        console.error("Error fetching customer leads:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'CUSTOMER') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, location, budget, urgency, serviceId, answers } = body;

        if (!title || !description || !location || !budget || !urgency || !serviceId) { 
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const newLead = await prisma.lead.create({
            data: {
                title,
                description,
                location,
                budget,
                urgency,
                serviceId,
                answers,
                customerId: session.user.id,
                status: 'OPEN',
            },
        });

        const admins = await prisma.user.findMany({
            where: { role: UserRole.ADMIN },
            select: { id: true }
        });

        if (admins.length > 0) {
            const notificationMessage = `New lead posted: "${newLead.title}". Ready for assignment.`;
            await prisma.notification.createMany({
                data: admins.map(admin => ({
                    userId: admin.id,
                    type: NotificationType.NEW_LEAD_FOR_ASSIGNMENT,
                    message: notificationMessage,
                    data: {
                        leadId: newLead.id
                    }
                }))
            });
        }

        return NextResponse.json(newLead, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}