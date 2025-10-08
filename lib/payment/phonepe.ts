import crypto from 'crypto';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/db';

const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID!;
const PHONEPE_SALT_KEY = process.env.PHONEPE_CLIENT_SECRET!;
const PHONEPE_SALT_INDEX = 1;
const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"; // UAT/Test URL
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;
const PHONEPE_CALLBACK_URL = `${APP_BASE_URL}/api/webhooks/phonepe`;

interface PaymentRequestPayload {
    merchantId: string;
    merchantTransactionId: string;
    merchantUserId: string;
    amount: number; // in paise
    redirectUrl: string;
    redirectMode: 'POST';
    callbackUrl: string;
    mobileNumber: string; // Optional but recommended
    paymentInstrument: {
        type: 'PAY_PAGE';
    };
}

export async function initiatePhonePePayment(userId: string, bundleId: string) {
    try {
        // 1. Fetch bundle details to get the correct price
        const bundle = await prisma.creditBundle.findUnique({ where: { id: bundleId } });
        if (!bundle) {
            throw new Error("Credit bundle not found.");
        }

        const merchantTransactionId = `MUID${uuidv4().replace(/-/g, '')}`;
        const amountInPaise = bundle.price * 100;

        // 2. Create a pending transaction record in your database
        await prisma.transaction.create({
            data: {
                userId: userId,
                bundleId: bundle.id,
                amount: bundle.price,
                credits: bundle.credits,
                provider: 'PHONEPE', 
                status: 'PENDING',   
                merchantTransactionId,
            }
        });

        // 3. Construct the payload
        const payload: PaymentRequestPayload = {
            merchantId: PHONEPE_MERCHANT_ID,
            merchantTransactionId,
            merchantUserId: userId,
            amount: amountInPaise,
            redirectUrl: `${APP_BASE_URL}/api/professional/wallet/return?txId=${merchantTransactionId}`,
            redirectMode: 'POST',
            callbackUrl: PHONEPE_CALLBACK_URL,
            mobileNumber: '9999999999',
            paymentInstrument: {
                type: 'PAY_PAGE',
            },
        };

        // 4. Create the checksum
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const stringToHash = base64Payload + '/pg/v1/pay' + PHONEPE_SALT_KEY;
        const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
        const checksum = sha256 + '###' + PHONEPE_SALT_INDEX;

        // 5. Make the API request to PhonePe
        const response = await axios.post(
            `${PHONEPE_HOST_URL}/pg/v1/pay`,
            { request: base64Payload },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-VERIFY': checksum,
                },
            }
        );

        // 6. Return the payment URL
        const paymentUrl = response.data.data.instrumentResponse.redirectInfo.url;
        return { paymentUrl, merchantTransactionId };

    } catch (error: any) {
        console.error("PhonePe initiation failed:", error.response?.data || error.message);
        throw new Error("Failed to initiate payment.");
    }
}