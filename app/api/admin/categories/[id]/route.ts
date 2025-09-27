import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, description } = body;
        if (!name) {
            return NextResponse.json({ message: "Category name is required" }, { status: 400 });
        }

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, description },
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const servicesCount = await prisma.service.count({
            where: {
                categoryId: id
            }
        })
        if (servicesCount > 0) {
            return NextResponse.json({ message: `Cannot delete category. It is currently associated with ${servicesCount} service(s).` }, { status: 400 });
        }
        await prisma.category.delete({
            where: { id }
        })
        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting category ${params.id}:`, error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}