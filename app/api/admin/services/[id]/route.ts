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