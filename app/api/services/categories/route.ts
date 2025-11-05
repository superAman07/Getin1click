import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const categoriesWithServices = await prisma.category.findMany({
      where: {
        // Only include categories that have at least one active service
        services: {
          some: {
            isActive: true,
          },
        },
      },
      include: {
        services: {
          // Only include active services within each category
          where: {
            isActive: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categoriesWithServices);
  } catch (error) {
    console.error("Error fetching categories with services:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}