import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { name, description, imageUrl, categoryId, isActive } = body;

    const updatedService = await prisma.$transaction(async (tx) => {
      // 1. Update the core service details
      const service = await tx.service.update({
        where: { id },
        data: {
          name,
          description,
          imageUrl,
          categoryId,
          isActive,
        },
      });

      // 2. If questions are provided, update them
      if (questions && Array.isArray(questions)) {
        // Delete existing questions and their options for this service
        const existingQuestions = await tx.question.findMany({ where: { serviceId: id } });
        const existingQuestionIds = existingQuestions.map(q => q.id);
        if (existingQuestionIds.length > 0) {
          await tx.option.deleteMany({ where: { questionId: { in: existingQuestionIds } } });
          await tx.question.deleteMany({ where: { id: { in: existingQuestionIds } } });
        }

        // Create the new questions and options
        for (const [qIndex, questionData] of questions.entries()) {
          const newQuestion = await tx.question.create({
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
                questionId: newQuestion.id,
              })),
            });
          }
        }
      }
      
      return service;
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error(`Error updating service ${(await params).id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting service ${(await params).id}:`, error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}