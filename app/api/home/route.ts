import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const featuredServices = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        category: {
          select: { name: true }
        }
      }
    });

    const categoriesWithServices = await prisma.category.findMany({
      where: {
        services: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        services: {
          where: {
            isActive: true,
          },
          take: 3,
        },
      },
      take: 6,
    });

    return NextResponse.json({ featuredServices, categoriesWithServices });
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}