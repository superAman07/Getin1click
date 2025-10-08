import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const txId = searchParams.get('txId');
    
    if (!txId) {
        return Response.redirect(new URL('/auth/login', request.url));
    }

    try {
        
        const transaction = await prisma.transaction.findUnique({
            where: { merchantTransactionId: txId },
            include: { bundle: true }
        });
        
        if (!transaction || !transaction.bundle) {
            return Response.redirect(new URL('/professional/wallet', request.url));
        }
        
        const redirectUrl = new URL('/professional/dashboard', request.url);
        redirectUrl.searchParams.set('payment', 'success');
        redirectUrl.searchParams.set('bundle_name', transaction.bundle.name);
        redirectUrl.searchParams.set('credits_added', String(transaction.bundle.credits));
        
        return Response.redirect(redirectUrl);
    } catch (error) {
        console.error("Return handler error:", error);
        return Response.redirect(new URL('/professional/wallet', request.url));
    }
}