import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;

    const conversationDetails = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      }
    });

    return NextResponse.json(conversationDetails)
  } catch (error) {
    return NextResponse.json(null);
  }
}