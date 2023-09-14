import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    messageId?: string;
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    try {
        const { messageId } = params;
        const currentUser = await getCurrentUser();

        if (!currentUser?.id) {
            return NextResponse.json(null);
        }

        const existingMessage = await prisma.message.findUnique({
            where: {
                id: messageId
            },
            include: {
                conversation: {
                    include: {
                        users: true
                    }
                }
            }
        });

        if (!existingMessage) {
            return new NextResponse('Invalid Message ID', { status: 400 });
        }

        if (existingMessage.senderId !== currentUser.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const conversationId = existingMessage.conversation.id;

        await prisma.message.delete({
            where: {
                id: messageId
            }
        });

        pusherServer.trigger(conversationId, 'messages:delete', { messageId });

        const updatedConversation = await prisma.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                lastMessageAt: new Date()
            },
            include: {
                users: true
            }
        });

        existingMessage.conversation.users.forEach((user) => {
            if (user.email) {
                pusherServer.trigger(user.email, 'conversation:update', updatedConversation);
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse('Error', { status: 500 });
    }
}
