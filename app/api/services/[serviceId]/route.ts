import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request, { params }: { params: { serviceId: string } }) {
    try {
        const service = await prisma.service.findUnique({
            where: { id: params.serviceId },
            include: {
                questions: {
                    where: {
                        type: 'CUSTOMER'
                    },
                    include: {
                        options: true
                    },
                    orderBy: {
                        text: 'asc'
                    }
                }
            }
        });

        if (!service) {
            return new NextResponse('Service not found', { status: 404 });
        }

        return NextResponse.json(service);
    } catch (error) {
        console.error("Error fetching service details:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}