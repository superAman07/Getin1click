import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();

    const { name, description, imageUrl, categoryId, isActive, questions, creditCost } = body;

    const updatedService = await prisma.$transaction(async (tx) => {
      const service = await tx.service.update({
        where: { id },
        data: {
          name,
          description,
          creditCost,
          imageUrl,
          categoryId,
          isActive,
        },
      });

      if (questions && Array.isArray(questions)) {
        const existingQuestions = await tx.question.findMany({ where: { serviceId: id } });
        const existingQuestionIds = new Set(existingQuestions.map(q => q.id));
        const incomingQuestionIds = new Set(questions.map(q => q.id).filter(Boolean));

        const questionsToDelete = existingQuestions.filter(q => !incomingQuestionIds.has(q.id));
        const questionIdsToDelete = questionsToDelete.map(q => q.id);

        if (questionIdsToDelete.length > 0) {
          await tx.professionalAnswer.deleteMany({ where: { questionId: { in: questionIdsToDelete } } });
          await tx.option.deleteMany({ where: { questionId: { in: questionIdsToDelete } } });
          await tx.question.deleteMany({ where: { id: { in: questionIdsToDelete } } });
        }

        for (const [qIndex, qData] of questions.entries()) {
          const questionPayload = {
            text: qData.text,
            order: qIndex + 1,
            type: qData.type,
            inputType: qData.inputType,
            serviceId: service.id,
          };

          const question = await tx.question.upsert({
            where: { id: qData.id || '' },
            update: questionPayload,
            create: questionPayload,
          });

          // Update options for the question
          if (qData.options && Array.isArray(qData.options)) {
            // Delete old options first
            await tx.option.deleteMany({ where: { questionId: question.id } });
            // Create new options
            if (qData.options.length > 0) {
              await tx.option.createMany({
                data: qData.options.map((opt: { text: string }) => ({
                  text: opt.text,
                  questionId: question.id,
                })),
              });
            }
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

export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
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