import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { initiatePhonePePayment } from '@/lib/payment/phonepe';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const { bundleId } = await request.json();
        if (!bundleId) {
            return new NextResponse('Bundle ID is required', { status: 400 });
        }

        const { paymentUrl } = await initiatePhonePePayment(session.user.id, bundleId);

        return NextResponse.json({ paymentUrl });

    } catch (error) {
        console.error("Checkout error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}