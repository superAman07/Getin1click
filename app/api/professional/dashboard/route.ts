import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "PROFESSIONAL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const professionalId = session.user.id;

    // --- METRICS ---

    // 1. Total Completed Jobs (Leads with status 'COMPLETED')
    const totalCompletedJobs = await prisma.lead.count({
      where: {
        status: "COMPLETED",
        assignments: {
          some: {
            professionalId: professionalId,
            status: "ACCEPTED",
          },
        },
      },
    });

    // 2. Total Earnings (This is an approximation based on Lead 'budget')
    // NOTE: Your schema's `budget` is a String. This query attempts to cast it to a number.
    // For accurate earnings, consider adding a numeric `finalPrice` field to the Lead model.
    const completedLeads = await prisma.lead.findMany({
      where: {
        status: "COMPLETED",
        assignments: {
          some: {
            professionalId: professionalId,
            status: "ACCEPTED",
          },
        },
      },
      select: {
        budget: true,
      },
    });

    const totalEarnings = completedLeads.reduce((sum, lead) => {
      const budgetValue = parseFloat(lead.budget?.replace(/[^0-9.-]+/g, "") || "0");
      return sum + (isNaN(budgetValue) ? 0 : budgetValue);
    }, 0);

    // 3. Average Rating
    const ratingsAggregation = await prisma.review.aggregate({
      where: {
        professionalId: professionalId,
      },
      _avg: {
        rating: true,
      },
    });
    const averageRating = ratingsAggregation._avg.rating;

    // 4. Active Leads
    const totalLeads = await prisma.leadAssignment.count({
      where: {
        professionalId: professionalId,
        status: "ACCEPTED",
        lead: {
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      },
    });

    // --- RECENT JOBS (LEADS) ---
    const recentLeads = await prisma.lead.findMany({
      where: {
        assignments: {
          some: { professionalId: professionalId },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      include: {
        customer: {
          select: { name: true },
        },
      },
    });

    // --- UPCOMING APPOINTMENTS (BOOKINGS) ---
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        professionalId: professionalId,
        bookingTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        bookingTime: "asc",
      },
      take: 3,
      include: {
        customer: {
          select: { name: true },
        },
        request: {
          include: {
            service: { select: { name: true } },
          },
        },
      },
    });

    // --- NOTIFICATIONS ---
    const notifications = await prisma.notification.findMany({
      where: {
        userId: professionalId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // --- FORMAT DATA FOR FRONTEND ---
    const formattedRecentJobs = recentLeads.map((lead) => ({
      id: lead.id,
      title: lead.title,
      status: lead.status.toLowerCase().replace(/_/g, "-"),
      customerName: lead.customer.name || "N/A",
      date: lead.updatedAt.toLocaleDateString(),
      amount: parseFloat(lead.budget?.replace(/[^0-9.-]+/g, "") || "0") || 0,
    }));

    const formattedAppointments = upcomingBookings.map((booking) => ({
      id: booking.id,
      title: booking.request.service.name,
      customerName: booking.customer.name || "N/A",
      dateTime: booking.bookingTime.toISOString(),
      location: booking.request.postcode,
    }));

    const dashboardData = {
      metrics: {
        totalCompletedJobs,
        totalEarnings,
        averageRating,
        totalLeads,
      },
      recentJobs: formattedRecentJobs,
      upcomingAppointments: formattedAppointments,
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        message: n.message,
        createdAt: n.createdAt.toISOString(),
        read: n.read,
      })),
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching professional dashboard data:", error);
    return NextResponse.json(
      { error: "An internal server error occurred while fetching dashboard data." },
      { status: 500 }
    );
  }
}