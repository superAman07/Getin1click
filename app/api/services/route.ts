import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const postcode = searchParams.get('postcode');

    if (!query || !postcode) {
        return new NextResponse('Search query and postcode are required', { status: 400 });
    }

    try {
        const availableServices = await prisma.service.findMany({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
                isActive: true,
                professionals: {
                    some: {
                        locations: {
                            some: {
                                postcode: {
                                    equals: postcode,
                                    mode: 'insensitive',
                                },
                            }
                        }
                    },
                },
            },
            include: {
                category: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json(availableServices);
    } catch (error) {
        console.error("Error searching for available services:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}