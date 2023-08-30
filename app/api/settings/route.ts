import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { name, image, isDarkTheme, status } = body; // Added 'status' here

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the 'status' property in the 'data' object
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        image: image,
        name: name,
        isDarkTheme: isDarkTheme,
        status: status, // Update the status here
      },
    });

    return new NextResponse(JSON.stringify(updatedUser), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Error', { status: 500 });
  }
}
