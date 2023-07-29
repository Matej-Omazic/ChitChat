import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  email?: string;
}

export async function GET(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { email } = params;

    const userDetails = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return NextResponse.json(userDetails)
  } catch (error) {
    return NextResponse.json(null);
  }
}