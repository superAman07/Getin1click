import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
        questions: {
          some: {
            type: 'PROFESSIONAL',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching professional services:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}