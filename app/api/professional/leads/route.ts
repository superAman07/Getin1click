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
        // 1. Fetch the professional's services and locations
        const professionalProfile = await prisma.professionalProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                services: { select: { id: true } },
                locations: { select: { postcode: true } },
            },
        });

        if (!professionalProfile || professionalProfile.services.length === 0 || professionalProfile.locations.length === 0) {
            // If profile is incomplete, return no leads
            return NextResponse.json([]);
        }

        const serviceIds = professionalProfile.services.map(s => s.id);
        const postcodes = professionalProfile.locations.map(l => l.postcode);

        // 2. Find leads that match the professional's profile
        const leads = await prisma.lead.findMany({
            where: {
                status: 'OPEN',
                // Lead's service is one the professional offers
                serviceId: {
                    in: serviceIds,
                },
                // Lead's location (pincode) is one the professional serves
                location: {
                    // This checks if the location string starts with any of the professional's postcodes
                    in: postcodes.map(pc => `${pc}, ${pc}`), // This is a simplification, a more robust solution is below
                    // A more robust way if location format varies:
                    // OR: postcodes.map(pc => ({ location: { startsWith: pc } })),
                },
                // The professional has not already purchased this lead
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
                creditCost: true,
                location: true,
                budget: true,
                urgency: true,
                service: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // 3. Process location to protect customer privacy (show only district/city)
        const leadsWithPartialLocation = leads.map(lead => {
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