import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from '@/app/libs/pusher'
import prisma from "@/app/libs/prismadb";


export async function PUT(
    request: Request,
) {
    try {
        const body = await request.json();
        const { messageId, isLiked } = body;

        // Validate input here if necessary

        const updatedMessage = await prisma.message.update({
            where: {
                id: messageId
            },
            data: {
                isLiked
            }
        });

        // Check if the message was updated successfully
        if (!updatedMessage) {
            return new NextResponse('Message not found', { status: 404 });
        }

        return NextResponse.json(updatedMessage);
    } catch (error) {
        console.error(error, 'ERROR_UPDATE_MESSAGE');
        return new NextResponse('Error', { status: 500 });
    }
}
