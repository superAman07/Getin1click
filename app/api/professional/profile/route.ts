import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      companyName,
      phoneNumber,
      pincode,
      locationName,
      selectedServiceIds,
      answers,
    } = body;

    const answerData = Object.entries(answers).map(([questionId, answerText]) => ({
      userId: session.user.id,
      questionId: questionId,
      answerText: answerText as string,
    }));

    await prisma.$transaction(async (tx) => {
      const profile = await tx.professionalProfile.upsert({
        where: { userId: session.user.id },
        update: {
          companyName: companyName,
          phoneNumber: phoneNumber,
          postcode: pincode,
          location: locationName,
          services: {
            set: selectedServiceIds.map((id: string) => ({ id })), // Use `set` to overwrite existing services
          },
        },
        create: {
          userId: session.user.id,
          companyName: companyName,
          phoneNumber: phoneNumber,
          postcode: pincode,
          location: locationName,
          services: {
            connect: selectedServiceIds.map((id: string) => ({ id })),
          },
        },
      });

      if (answers && Object.keys(answers).length > 0) {
        for (const [questionId, answerText] of Object.entries(answers)) {
          await tx.professionalAnswer.upsert({
            where: {
              userId_questionId: {
                userId: session.user.id,
                questionId: questionId,
              },
            },
            update: {
              answerText: answerText as string,
            },
            create: {
              userId: session.user.id,
              questionId: questionId,
              answerText: answerText as string,
            },
          });
        }
      }

      await tx.user.update({
        where: { id: session.user.id },
        data: { onboardingComplete: true },
      });
    },
      { maxWait: 10_000, timeout: 20_000 }
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error saving professional profile:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}