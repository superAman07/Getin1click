import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = (await params).id;
    try {
        const questions = await prisma.question.findMany({
            where: {
                id: id,
                ...(type && { type: type as 'CUSTOMER' | 'PROFESSIONAL' })
            },
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(questions);
    } catch (error) {
        console.error("Error fetching questions for service:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}