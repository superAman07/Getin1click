import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';
import { UserRole, UserStatus } from '@prisma/client';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = (await params).id;
    try {
        const professional = await prisma.user.findUnique({
            where: { id: id, role: UserRole.PROFESSIONAL },
            include: {
                professionalProfile: {
                    include: {
                        services: true,
                        locations: true,
                        photos: true,
                    }
                },
                professionalAnswers: {
                    include: {
                        question: true
                    }
                }
            }
        });

        if (!professional) {
            return new NextResponse('Professional not found', { status: 404 });
        }

        return NextResponse.json(professional);
    } catch (error) {
        console.error(`Error fetching professional ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = (await params).id;
    try {
        const body = await request.json();
        const { status, credits } = body;

        const updateData: { user?: any, profile?: any } = {};

        if (status && Object.values(UserStatus).includes(status)) {
            updateData.user = { status: status };
        }

        if (credits !== undefined && typeof credits === 'number') {
            updateData.profile = { credits: credits };
        }

        const updatedProfessional = await prisma.$transaction(async (tx) => {
            if (updateData.user) {
                await tx.user.update({
                    where: { id: id },
                    data: updateData.user
                });
            }
            if (updateData.profile) {
                await tx.professionalProfile.update({
                    where: { userId: id },
                    data: updateData.profile
                });
            }
            return tx.user.findUnique({ where: { id: id } });
        });

        return NextResponse.json(updatedProfessional);

    } catch (error) {
        console.error(`Error updating professional ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.ADMIN) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const id = (await params).id;
    try {
        const professionalId = (await params).id;

        await prisma.$transaction(async (tx) => {
            await tx.professionalProfile.delete({
                where: { userId: professionalId }
            });

            await tx.user.delete({
                where: { id: professionalId }
            });
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error(`Error deleting professional ${id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}