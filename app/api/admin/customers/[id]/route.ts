import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole, UserStatus } from '@prisma/client';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const id = (await params).id;

    try {
        const customer = await prisma.user.findUnique({
            where: { id: id, role: UserRole.CUSTOMER },
            include: {
                postedLeads: {
                    orderBy: { createdAt: 'desc' },
                    include: { service: { select: { name: true } } }
                }
            }
        });

        if (!customer) {
            return new NextResponse('Customer not found', { status: 404 });
        }

        return NextResponse.json(customer);
    } catch (error) {
        console.error(`Error fetching customer ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const id = (await params).id;

    try {
        const body = await request.json();
        const { status } = body;

        if (!status || !Object.values(UserStatus).includes(status)) {
            return new NextResponse('Invalid status provided', { status: 400 });
        }

        const updatedCustomer = await prisma.user.update({
            where: { id: id, role: UserRole.CUSTOMER },
            data: { status: status }
        });

        return NextResponse.json(updatedCustomer);
    } catch (error) {
        console.error(`Error updating customer ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }
    const id = (await params).id;

    try {
        await prisma.user.delete({
            where: { id: id, role: UserRole.CUSTOMER }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`Error deleting customer ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}