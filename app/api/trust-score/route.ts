import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // 1. Fetch Admin Settings
        const configs = await prisma.configuration.findMany({
            where: { key: { in: ['TRUST_SCORE_VISIBILITY', 'TRUST_SCORE_BASE_RATING', 'TRUST_SCORE_BASE_COUNT'] } },
        });

        const isVisible = configs.find(c => c.key === 'TRUST_SCORE_VISIBILITY')?.value === 'true' || false;
        if (!isVisible) {
            return NextResponse.json({ isVisible: false });
        }

        const baseRating = parseFloat(configs.find(c => c.key === 'TRUST_SCORE_BASE_RATING')?.value || '0');
        const baseCount = parseInt(configs.find(c => c.key === 'TRUST_SCORE_BASE_COUNT')?.value || '0', 10);

        // 2. Fetch Organic Review Data
        const organicData = await prisma.platformReview.aggregate({
            _avg: { rating: true },
            _count: { id: true },
        });

        const organicRating = organicData._avg.rating || 0;
        const organicCount = organicData._count.id || 0;

        // 3. Calculate Weighted Average
        const totalCount = baseCount + organicCount;
        const totalRatingSum = (baseRating * baseCount) + (organicRating * organicCount);
        
        const finalRating = totalCount > 0 ? totalRatingSum / totalCount : 0;

        return NextResponse.json({
            isVisible: true,
            trustScore: finalRating.toFixed(1),
            reviewCount: totalCount,
        });

    } catch (error) {
        console.error('[TRUST_SCORE_GET]', error);
        // On error, gracefully hide the score
        return NextResponse.json({ isVisible: false });
    }
}