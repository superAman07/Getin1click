import { NextResponse,NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const bundles = await prisma.creditBundle.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
        return NextResponse.json(bundles);
    } catch (error) {
        console.error("Error fetching credit bundles:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}