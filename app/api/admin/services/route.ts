import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, categoryId, questions } = body;

    if (!name || !categoryId || !questions || !Array.isArray(questions)) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const newService = await prisma.$transaction(async (tx) => {

      const service = await tx.service.create({
        data: {
          name,
          description,
          imageUrl,
          categoryId,
          isActive: true,
        },
      });

      for (const [qIndex, questionData] of questions.entries()) {
        const question = await tx.question.create({
          data: {
            text: questionData.text,
            order: qIndex + 1,
            serviceId: service.id,
          },
        });

        if (questionData.options && Array.isArray(questionData.options)) {
          await tx.option.createMany({
            data: questionData.options.map((opt: { text: string }) => ({
              text: opt.text,
              questionId: question.id,
            })),
          });
        }
      }

      return service;
    },
      {
        maxWait: 5000,
        timeout: 30000,
      }
    );

    return NextResponse.json(newService, { status: 201 });

  } catch (error) {
    console.error("Error creating service:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}