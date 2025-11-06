import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

const VISIBILITY_KEY = 'TRUST_SCORE_VISIBILITY';
const BASE_RATING_KEY = 'TRUST_SCORE_BASE_RATING';
const BASE_COUNT_KEY = 'TRUST_SCORE_BASE_COUNT';

// GET handler to fetch current settings
export async function GET() {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const configs = await prisma.configuration.findMany({
            where: { key: { in: [VISIBILITY_KEY, BASE_RATING_KEY, BASE_COUNT_KEY] } },
        });

        const settings = {
            isVisible: configs.find(c => c.key === VISIBILITY_KEY)?.value === 'true' || false,
            baseRating: parseFloat(configs.find(c => c.key === BASE_RATING_KEY)?.value || '4.0'),
            baseCount: parseInt(configs.find(c => c.key === BASE_COUNT_KEY)?.value || '100', 10),
        };

        return NextResponse.json(settings);
    } catch (error) {
        console.error('[ADMIN_TRUST_SCORE_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// POST handler to update settings
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { isVisible, baseRating, baseCount } = await request.json();

        const transactions = [
            prisma.configuration.upsert({ where: { key: VISIBILITY_KEY }, update: { value: String(isVisible) }, create: { key: VISIBILITY_KEY, value: String(isVisible) } }),
            prisma.configuration.upsert({ where: { key: BASE_RATING_KEY }, update: { value: String(baseRating) }, create: { key: BASE_RATING_KEY, value: String(baseRating) } }),
            prisma.configuration.upsert({ where: { key: BASE_COUNT_KEY }, update: { value: String(baseCount) }, create: { key: BASE_COUNT_KEY, value: String(baseCount) } }),
        ];

        await prisma.$transaction(transactions);

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('[ADMIN_TRUST_SCORE_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}