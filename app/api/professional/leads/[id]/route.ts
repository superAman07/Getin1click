import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

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
                professionalId: session.user.id, // Ensure it belongs to the user
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
            const professional = await prisma.professionalProfile.findUnique({
                where: { userId: session.user.id },
                select: { credits: true }
            });

            const creditCost = assignment.lead.service.creditCost ?? 1;

            if (!professional || (professional.credits || 0) < creditCost) {
                return new NextResponse('Insufficient credits to accept this lead.', { status: 402 });
            }

            // Use a transaction to ensure atomicity
            const [, updatedAssignment] = await prisma.$transaction([
                prisma.professionalProfile.update({
                    where: { userId: session.user.id },
                    data: { credits: { decrement: creditCost } },
                }),
                prisma.leadAssignment.update({
                    where: { id },
                    data: { status: 'ACCEPTED' },
                })
            ]);

            return NextResponse.json({
                message: 'Lead accepted successfully!',
                customerDetails: {
                    name: assignment.lead.customer.name,
                    email: assignment.lead.customer.email,
                    phoneNumber: assignment.lead.customer.professionalProfile?.phoneNumber
                },
            });

        } else { // REJECT action
            await prisma.leadAssignment.update({
                where: { id },
                data: { status: 'REJECTED' },
            });

            return NextResponse.json({ message: 'Lead rejected.' });
        }

    } catch (error) {
        console.error(`Error updating assignment ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}