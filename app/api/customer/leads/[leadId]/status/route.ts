import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== 'CUSTOMER') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { leadId } = params;
  if (!leadId) {
    return new NextResponse('Lead ID is required', { status: 400 });
  }

  try {
    const body = await request.json();
    const { status, rating, feedback } = body;

    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        customerId: session.user.id
      },
      include: {
        assignments: {
          where: { status: 'ACCEPTED' },
          select: { professionalId: true }
        }
      }
    });

    if (!lead) {
      return new NextResponse('Lead not found or you do not have permission', { status: 404 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status }
    });

    if (status === 'COMPLETED' && rating && lead.assignments.length > 0) {
      const professionalId = lead.assignments[0].professionalId; // Assuming one professional per lead for now
      await prisma.review.create({
        data: {
          rating,
          comment: feedback,
          professionalId,
          customerId: session.user.id,
          leadId: lead.id,
        }
      });
    }
    
    if (status === 'ISSUE_REPORTED') {
      await prisma.customerSupport.create({
        data: {
          customerId: session.user.id,
          leadId: lead.id,
          issue: feedback,
          status: 'PENDING',
          type: 'REFUND_REQUEST'
        }
      });
    }

    return NextResponse.json({ success: true, updatedLead });
  } catch (error) {
    console.error(`Error updating lead ${leadId} status:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}