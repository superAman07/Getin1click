import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { name, description, imageUrl, categoryId, isActive, questions } = body;

    const updatedService = await prisma.$transaction(async (tx) => {
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

      if (questions && Array.isArray(questions)) {
        const existingQuestions = await tx.question.findMany({ where: { serviceId: id } });
        const existingQuestionIds = existingQuestions.map(q => q.id);
        if (existingQuestionIds.length > 0) {
          await tx.option.deleteMany({ where: { questionId: { in: existingQuestionIds } } });
          await tx.question.deleteMany({ where: { id: { in: existingQuestionIds } } });
        }

        for (const [qIndex, questionData] of questions.entries()) {
          const newQuestion = await tx.question.create({
            data: {
              text: questionData.text,
              order: qIndex + 1,
              type: questionData.type,
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
    }, {
      maxWait: 10000,
      timeout: 30000,
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

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting service ${(await params).id}:`, error);
    // Use NextResponse for error responses as well for consistency
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}