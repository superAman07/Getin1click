import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const profile = await prisma.professionalProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            professionalAnswers: {
              include: {
                question: true,
              },
            },
          },
        },
        services: true,
        photos: true,
      }
    });

    if (!profile) {
      return new NextResponse('Profile not found', { status: 404 });
    }

    // Get all questions for the services this professional offers
    const serviceIds = profile.services.map(s => s.id);
    const serviceQuestions = await prisma.question.findMany({
      where: {
        serviceId: { in: serviceIds },
        type: 'PROFILE_FAQ', // Fetch the Q&A questions
      },
    });

    // Combine profile data with the questions for the Q&A section
    const responseData = {
      ...profile,
      qas: serviceQuestions,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching professional profile:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// PUT handler to update the professional's profile
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.companyName !== undefined) dataToUpdate.companyName = body.companyName;
    if (body.companyLogoUrl !== undefined) dataToUpdate.companyLogoUrl = body.companyLogoUrl;
    if (body.profilePictureUrl !== undefined) dataToUpdate.profilePictureUrl = body.profilePictureUrl;
    if (body.companyEmail !== undefined) dataToUpdate.companyEmail = body.companyEmail;
    if (body.companyPhoneNumber !== undefined) dataToUpdate.companyPhoneNumber = body.companyPhoneNumber;
    if (body.websiteUrl !== undefined) dataToUpdate.websiteUrl = body.websiteUrl;
    if (body.companySize !== undefined) dataToUpdate.companySize = body.companySize;
    if (body.yearFounded !== undefined) dataToUpdate.yearFounded = body.yearFounded;
    if (body.bio !== undefined) dataToUpdate.bio = body.bio;
    if (body.locations !== undefined) {
      dataToUpdate.locations = {
        deleteMany: {},
        create: body.locations.map((loc: { postcode: string; locationName: string; isPrimary: boolean }) => ({
          postcode: loc.postcode,
          locationName: loc.locationName,
          isPrimary: loc.isPrimary,
        })),
      };
    }
    if (body.socialMedia !== undefined) dataToUpdate.socialMedia = body.socialMedia;
    if (body.services !== undefined) {
      dataToUpdate.services = { set: body.services.map((s: { id: string }) => ({ id: s.id })) };
    }
    if (body.photos !== undefined) {
      dataToUpdate.photos = {
        deleteMany: {},
        create: body.photos.map((p: { url: string, caption?: string }) => ({ url: p.url, caption: p.caption })),
      };
    }

    const updatedProfile = await prisma.$transaction(async (tx) => {
      // 1. Update the main profile with only the provided data
      const profile = await tx.professionalProfile.update({
        where: { userId: session.user.id },
        data: dataToUpdate,
      });

      // 2. Upsert the answers for the Q&A section (this logic is already correct)
      if (body.qas) {
        for (const [questionId, answerText] of Object.entries(body.qas)) {
          if (typeof answerText === 'string' && answerText.trim() !== '') {
            await tx.professionalAnswer.upsert({
              where: { userId_questionId: { userId: session.user.id, questionId } },
              update: { answerText },
              create: { userId: session.user.id, questionId, answerText },
            });
          }
        }
      }
      return profile;
    }, {
      maxWait: 10000,
      timeout: 30000,
    }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating professional profile:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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
          services: {
            set: selectedServiceIds.map((id: string) => ({ id })), // Use `set` to overwrite existing services
          },
          locations: {
            deleteMany: {},
            create: {
              postcode: pincode,
              locationName: locationName,
              isPrimary: true,
            }
          }
        },
        create: {
          userId: session.user.id,
          companyName: companyName,
          phoneNumber: phoneNumber,
          services: {
            connect: selectedServiceIds.map((id: string) => ({ id })),
          },
          locations: {
            create: {
              postcode: pincode,
              locationName: locationName,
              isPrimary: true,
            }
          }
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