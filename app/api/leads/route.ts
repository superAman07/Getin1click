import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'CUSTOMER') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, location, budget, urgency, serviceId } = body;

        if (!title || !description || !location || !urgency || !serviceId) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Simple logic to determine credit cost. This can be made more complex later.
        // For now: Low urgency = 2, Medium = 3, High = 4 credits.
        let creditCost = 2;
        if (urgency === 'MEDIUM') creditCost = 3;
        if (urgency === 'HIGH') creditCost = 4;

        const newLead = await prisma.lead.create({
            data: {
                title,
                description,
                location,
                budget,
                urgency,
                serviceId,
                creditCost,
                customerId: session.user.id,
                status: 'OPEN',
            },
        });

        return NextResponse.json(newLead, { status: 201 });
    } catch (error) {
        console.error("Error creating lead:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}