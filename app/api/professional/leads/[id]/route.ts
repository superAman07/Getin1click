import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { LeadAssignmentStatus, UserRole } from '@prisma/client';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== UserRole.PROFESSIONAL) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = (await params).id;
    if (!id) {
        return new NextResponse('Assignment ID is required', { status: 400 });
    }

    try {
        const body = await request.json();
        const { action } = body;

        if (!action || !['ACCEPT', 'REJECT'].includes(action)) {
            return new NextResponse('Invalid action. Must be ACCEPT or REJECT', { status: 400 });
        }

        const assignment = await prisma.leadAssignment.findUnique({
            where: {
                id,
                professionalId: session.user.id,
            },
            include: {
                lead: {
                    include: {
                        service: true,
                        customer: {
                            select: {
                                name: true,
                                email: true,
                                professionalProfile: {
                                    select: {
                                        phoneNumber: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!assignment) {
            return new NextResponse('Assignment not found or you do not have permission', { status: 404 });
        }

        if (assignment.status !== 'PENDING') {
            return new NextResponse(`This lead has already been ${assignment.status.toLowerCase()}.`, { status: 409 });
        }

        if (action === 'ACCEPT') {
            const creditCost = assignment.lead.service.creditCost ?? 1;

            const updatedData = await prisma.$transaction(async (tx) => {
                // CRITICAL: Re-fetch the lead inside the transaction to lock it and prevent race conditions
                const lead = await tx.lead.findUnique({
                    where: { id: assignment.leadId },
                });

                if (lead?.status !== 'ASSIGNED') {
                    // Another professional has already accepted this lead.
                    throw new Error('LEAD_TAKEN');
                }

                const professional = await tx.professionalProfile.findUnique({
                    where: { userId: session.user.id },
                    select: { credits: true }
                });

                if (!professional || (professional.credits || 0) < creditCost) {
                    throw new Error('INSUFFICIENT_CREDITS');
                }

                // 1. Update this professional's assignment to ACCEPTED
                await tx.leadAssignment.update({
                    where: { id },
                    data: { status: LeadAssignmentStatus.ACCEPTED },
                });

                // 2. Update the lead's main status to ACCEPTED
                await tx.lead.update({
                    where: { id: assignment.leadId },
                    data: { status: 'ACCEPTED' },
                });

                // 3. Set all other pending assignments for this lead to MISSED
                await tx.leadAssignment.updateMany({
                    where: {
                        leadId: assignment.leadId,
                        professionalId: { not: session.user.id },
                        status: LeadAssignmentStatus.PENDING,
                    },
                    data: { status: LeadAssignmentStatus.MISSED },
                });

                // 4. Decrement credits
                await tx.professionalProfile.update({
                    where: { userId: session.user.id },
                    data: { credits: { decrement: creditCost } },
                });

                return {
                    customerDetails: {
                        name: assignment.lead.customer.name,
                        email: assignment.lead.customer.email,
                        phoneNumber: assignment.lead.customer.professionalProfile?.phoneNumber
                    }
                };
            });

            return NextResponse.json(updatedData);
            // const professional = await prisma.professionalProfile.findUnique({
            //     where: { userId: session.user.id },
            //     select: { credits: true }
            // });

            // const creditCost = assignment.lead.service.creditCost ?? 1;

            // if (!professional || (professional.credits || 0) < creditCost) {
            //     return new NextResponse('Insufficient credits to accept this lead.', { status: 402 });
            // }

            // const [, updatedAssignment] = await prisma.$transaction([
            //     prisma.professionalProfile.update({
            //         where: { userId: session.user.id },
            //         data: { credits: { decrement: creditCost } },
            //     }),
            //     prisma.leadAssignment.update({
            //         where: { id },
            //         data: { status: 'ACCEPTED' },
            //     })
            // ]);

            // return NextResponse.json({
            //     message: 'Lead accepted successfully!',
            //     customerDetails: {
            //         name: assignment.lead.customer.name,
            //         email: assignment.lead.customer.email,
            //         phoneNumber: assignment.lead.customer.professionalProfile?.phoneNumber
            //     },
            // });

        } else {
            await prisma.leadAssignment.update({
                where: { id },
                data: { status: LeadAssignmentStatus.REJECTED },
            });

            return NextResponse.json({ message: 'Lead rejected.' });
        }

    } catch (error: any) {
        if (error.message === 'LEAD_TAKEN') {
            return new NextResponse('This lead has already been taken by another professional.', { status: 409 }); // 409 Conflict
        }
        if (error.message === 'INSUFFICIENT_CREDITS') {
            return new NextResponse('Insufficient credits to accept this lead.', { status: 402 }); // 402 Payment Required
        }
        console.error(`Error updating assignment ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}