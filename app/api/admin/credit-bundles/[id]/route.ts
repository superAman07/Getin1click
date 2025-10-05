import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const id = (await params).id
        const bundle = await prisma.creditBundle.findUnique({
            where: { id: id },
        });
        if (!bundle) {
            return new NextResponse('Bundle not found', { status: 404 });
        }
        return NextResponse.json(bundle);
    } catch (error) {
        console.error("Error fetching credit bundle:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, description, price, credits, isActive } = body;
        const id = (await params).id

        const updatedBundle = await prisma.creditBundle.update({
            where: { id: id },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                credits: credits ? parseInt(credits, 10) : undefined,
                isActive,
            },
        });

        return NextResponse.json(updatedBundle);
    } catch (error) {
        console.error("Error updating credit bundle:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const id = (await params).id
        await prisma.creditBundle.delete({
            where: { id: id },
        });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting credit bundle:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}