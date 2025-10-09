import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/db';

const PHONEPE_SALT_KEY = process.env.PHONEPE_CLIENT_SECRET!;
const PHONEPE_SALT_INDEX = 1;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("[WEBHOOK] Received payload:", JSON.stringify(body));

        const base64Response = body.response;
        const xVerifyHeader = request.headers.get('X-VERIFY') || '';

        console.log("[WEBHOOK] Headers:", JSON.stringify(Object.fromEntries(request.headers.entries())));

        const stringToHash = base64Response + PHONEPE_SALT_KEY;
        const calculatedChecksum = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###' + PHONEPE_SALT_INDEX;

        console.log("[WEBHOOK] Calculated checksum:", calculatedChecksum);
        console.log("[WEBHOOK] Received X-VERIFY:", xVerifyHeader);

        if (xVerifyHeader !== calculatedChecksum) {
            console.error("PhonePe Webhook: Checksum mismatch.");
            return new NextResponse('Checksum mismatch', { status: 400 });
        }

        const decodedResponse = JSON.parse(Buffer.from(base64Response, 'base64').toString());
        console.log("[WEBHOOK] Decoded response:", JSON.stringify(decodedResponse));

        const code = decodedResponse.code;
        const merchantTransactionId = decodedResponse.data.merchantTransactionId; console.log("[WEBHOOK] Payment code:", code);
        console.log("[WEBHOOK] Payment code:", code);
        console.log("[WEBHOOK] merchantTransactionId:", merchantTransactionId);

        const transaction = await prisma.transaction.findUnique({
            where: { merchantTransactionId },
            include: { bundle: true }
        });

        if (!transaction) {
            console.error(`Webhook: Received valid callback for an unknown transaction ID ${merchantTransactionId}`);
            return new NextResponse('Transaction not found', { status: 404 });
        }

        if ((code === 'PAYMENT_SUCCESS' || code === 'SUCCESS' || code?.includes('SUCCESS')) && transaction.status === 'PENDING') {
            const bundle = transaction.bundle;
            if (!bundle) {
                console.error(`Webhook: Bundle not found for successful transaction ${merchantTransactionId}. Cannot grant credits.`);
                await prisma.transaction.update({ where: { id: transaction.id }, data: { status: 'FAILED' } });
                return new NextResponse('Bundle associated with transaction not found', { status: 404 });
            }

            await prisma.$transaction(async (tx) => {
                const updatedProfile = await tx.professionalProfile.update({
                    where: { userId: transaction.userId },
                    data: { credits: { increment: bundle.credits } },
                });
                console.log(`[WEBHOOK] User ${transaction.userId} credits updated to: ${updatedProfile.credits}`);
                await tx.transaction.update({
                    where: { id: transaction.id },
                    data: { status: 'SUCCESS' },
                });
            });
            console.log(`Credits granted for transaction ${merchantTransactionId}.`);

        } else if (code !== 'PAYMENT_SUCCESS') {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status: 'FAILED' },
            });
            console.log(`Payment failed for transaction ${merchantTransactionId}.`);
        }

        return new NextResponse('Webhook processed', { status: 200 });

    } catch (error) {
        console.error("PhonePe Webhook Error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}