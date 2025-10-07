import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ leadId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, description, location, budget, urgency } = body;

        const id = (await params).leadId;
        const leadToUpdate = await prisma.lead.findUnique({
            where: { id }
        });

        if (!leadToUpdate || leadToUpdate.customerId !== session.user.id) {
            return new NextResponse('Lead not found or you do not have permission to edit it', { status: 404 });
        }

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { title, description, location, budget, urgency },
        });

        return NextResponse.json(updatedLead);
    } catch (error) {
        console.error("Error updating lead:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// DELETE a specific lead
export async function DELETE(request: Request, { params }: { params: Promise<{ leadId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = (await params).leadId;

    try {
        const leadToDelete = await prisma.lead.findUnique({
            where: { id }
        });

        if (!leadToDelete || leadToDelete.customerId !== session.user.id) {
            return new NextResponse('Lead not found or you do not have permission to delete it', { status: 404 });
        }

        await prisma.lead.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error("Error deleting lead:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}