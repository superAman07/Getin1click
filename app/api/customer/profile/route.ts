import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== UserRole.CUSTOMER) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { phoneNumber, address } = await request.json();

        if (!phoneNumber) {
            return new NextResponse('Phone number is required', { status: 400 });
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                phoneNumber,
                address,
            },
        });

        return NextResponse.json({ message: 'Profile updated successfully' });

    } catch (error) {
        console.error("Error updating customer profile:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}