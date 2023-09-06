import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";


export async function PUT(
    request: Request,
) {
    try {
        const body = await request.json();
        const { messageId, isLiked } = body;


        const updatedMessage = await prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                isLiked
            }
        });

        if (!updatedMessage) {
            return new NextResponse('Message not found', { status: 404 });
        }

        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.error(error, 'ERROR_UPDATE_MESSAGE');
        return new NextResponse('Error', { status: 500 });
    }
}
