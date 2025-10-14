import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const leadId = (await params).id;
    if (!leadId) {
        return new NextResponse('Lead ID missing', { status: 400 });
    }

    try {
        const body = await request.json();
        const { professionalId } = body;

        if (!professionalId) {
            return new NextResponse('Professional ID missing', { status: 400 });
        }

        const lead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        if (!lead) {

            return new NextResponse('Lead not found', { status: 404 });
        }

        const existingAssignment = await prisma.leadAssignment.findUnique({
            where: {
                leadId_professionalId: {
                    leadId,
                    professionalId,
                },
            },
        });

        if (existingAssignment) {
            return new NextResponse('This professional has already been assigned this lead.', { status: 409 });
        }

        const assignment = await prisma.leadAssignment.create({
            data: {
                leadId,
                professionalId,
                status: 'PENDING',
            },
            include: {
                professional: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Update the lead status
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: 'ASSIGNED' }
        });

        return NextResponse.json(assignment);
    } catch (error) {
        console.error(`Error assigning lead ${leadId}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}