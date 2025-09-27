import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { name, description, imageUrl, categoryId, isActive } = body;

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name,
        description,
        imageUrl,
        categoryId,
        isActive,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error(`Error updating service ${params.id}:`, error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting service ${params.id}:`, error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}