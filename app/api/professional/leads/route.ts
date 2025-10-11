import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'PROFESSIONAL') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const professionalProfile = await prisma.professionalProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                services: { select: { id: true } },
                locations: { select: { postcode: true } },
            },
        });

        if (!professionalProfile || professionalProfile.services.length === 0) {
            return NextResponse.json([]);
        }

        const serviceIds = professionalProfile.services.map(s => s.id);
        const postcodes = professionalProfile.locations.map(l => l.postcode);

        const leads = await prisma.lead.findMany({
            where: {
                status: 'OPEN',
                serviceId: {
                    in: serviceIds,
                },
                ...(postcodes.length > 0 ? {
                    OR: postcodes.map(pc => ({
                        location: {
                            contains: pc,
                        }
                    }))
                } : {}),
                purchasedBy: {
                    none: {
                        id: session.user.id,
                    },
                },
            },
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                location: true,
                budget: true,
                urgency: true,
                service: {
                    select: {
                        name: true,
                        creditCost: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const leadsWithCost = leads.map(lead => ({
            ...lead,
            creditCost: lead.service.creditCost ?? 1,
        }));

        const leadsWithPartialLocation = leadsWithCost.map(lead => {
            const locationParts = lead.location.split(', ');
            const partialLocation = locationParts.length > 1 ? locationParts.slice(1).join(', ') : lead.location;
            return { ...lead, location: partialLocation };
        });

        return NextResponse.json(leadsWithPartialLocation);

    } catch (error) {
        console.error("Error fetching professional leads:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}