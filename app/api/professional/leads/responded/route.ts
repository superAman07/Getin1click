import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== UserRole.PROFESSIONAL) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const assignments = await prisma.leadAssignment.findMany({
            where: {
                professionalId: session.user.id,
                status: {
                    in: ['ACCEPTED', 'REJECTED', 'MISSED']
                }
            },
            include: {
                lead: {
                    include: {
                        service: {
                            select: {
                                name: true,
                                creditCost: true,
                            }
                        },
                        customer: {
                            select: {
                                name: true,
                                email: true,
                                phoneNumber: true, 
                                address: true      
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        const acceptedLeads = assignments.map(assignment => {
            const { lead } = assignment;
            const customerDetails = assignment.status === 'ACCEPTED' ? {
                name: lead.customer.name || 'Customer',
                email: lead.customer.email,
                phoneNumber: lead.customer.phoneNumber || null,
                address: lead.customer.address || null
            } : undefined;
            
            return {
                ...lead,
                assignmentId: assignment.id,
                assignmentStatus: assignment.status,
                creditCost: lead.service.creditCost ?? 1,
                customerDetails
                // creditCost: lead.service.creditCost ?? 1,
                // customerDetails: {
                //     name: lead.customer.name || 'Customer',
                //     email: lead.customer.email,
                //     phoneNumber: lead.customer.phoneNumber || null,
                //     address: lead.customer.address || null
                // }
            };
        });

        return NextResponse.json(acceptedLeads);

    } catch (error) {
        console.error("Error fetching accepted professional leads:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}