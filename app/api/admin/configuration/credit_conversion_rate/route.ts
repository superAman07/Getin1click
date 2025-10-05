import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

const CONFIG_KEY = 'credit_conversion_rate';

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const config = await prisma.configuration.findUnique({
            where: { key: CONFIG_KEY },
        });

        const rate = config ? parseFloat(config.value) : 1000; 

        return NextResponse.json({ rupeesPerCredit: rate });
    } catch (error) {
        console.error("Error fetching conversion rate:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await request.json();
        const { rupeesPerCredit } = body;

        if (typeof rupeesPerCredit !== 'number' || rupeesPerCredit <= 0) {
            return new NextResponse('Invalid rate value', { status: 400 });
        }

        const updatedConfig = await prisma.configuration.upsert({
            where: { key: CONFIG_KEY },
            update: { value: String(rupeesPerCredit) },
            create: { key: CONFIG_KEY, value: String(rupeesPerCredit) },
        });

        return NextResponse.json({ rupeesPerCredit: parseFloat(updatedConfig.value) });
    } catch (error) {
        console.error("Error updating conversion rate:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}