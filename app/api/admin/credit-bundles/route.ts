import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const bundles = await prisma.creditBundle.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(bundles);
    } catch (error) {
        console.error("Error fetching credit bundles:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, description, price, credits, isActive } = body;

        if (!name || !price || !credits) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const newBundle = await prisma.creditBundle.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                credits: parseInt(credits, 10),
                isActive,
            },
        });

        return NextResponse.json(newBundle, { status: 201 });
    } catch (error) {
        console.error("Error creating credit bundle:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}