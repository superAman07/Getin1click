import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { subDays } from 'date-fns';

export async function GET() {
  try {

    const thirtyDaysAgo = subDays(new Date(), 30);
    // --- Key Metrics ---
    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalProfessionals = await prisma.user.count({ where: { role: 'PROFESSIONAL' } });
    const newCustomersLast30Days = await prisma.user.count({
      where: { role: 'CUSTOMER', createdAt: { gte: thirtyDaysAgo } }
    });
    const newProfessionalsLast30Days = await prisma.user.count({
      where: { role: 'PROFESSIONAL', createdAt: { gte: thirtyDaysAgo } }
    });
    // const pendingProfessionalApprovals = await prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } });

    // --- Lead Funnel Metrics ---
    const newLeadsToAssign = await prisma.lead.count({ where: { status: 'OPEN' } });
    const leadsPendingProfessionalAcceptance = await prisma.lead.count({ where: { status: 'ASSIGNED' } });
    const activeJobsInProgress = await prisma.lead.count({ where: { status: 'ACCEPTED' } });
    const completedJobs = await prisma.lead.count({ where: { status: 'COMPLETED' } });

    // --- Recent Users ---
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // --- Chart Data: User Sign-ups in the last 7 days ---
    const sevenDaysAgo = subDays(new Date(), 7);
    const dailySignups = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Process data for the chart
    const signupChartData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateString = date.toISOString().split('T')[0];
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            Customers: 0,
            Professionals: 0,
        };
    });

    const recentSignups = await prisma.user.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, role: true }
    });

    recentSignups.forEach(user => {
        const dateStr = user.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const entry = signupChartData.find(d => d.date === dateStr);
        if (entry) {
            if (user.role === 'CUSTOMER') entry.Customers++;
            if (user.role === 'PROFESSIONAL') entry.Professionals++;
        }
    });

    return NextResponse.json({
      metrics: {
        totalCustomers,
        totalProfessionals,
        newCustomersLast30Days,
        newProfessionalsLast30Days,
        newLeadsToAssign,
        leadsPendingProfessionalAcceptance,
        activeJobsInProgress,
        completedJobs,
      },
      recentUsers,
      signupChartData,
    });

  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}