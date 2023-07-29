import bcrypt from "bcrypt";

import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {

  try{
  const body = await request.json();
  console.log("BODY: ", body)
  const {
    data: {
    email,
    name,
    password
    },
    public_key
  } = body;

  if(!email || !name || !password){
    return new NextResponse('Missing info', {status: 400})
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      public_key
    }
  });

  return NextResponse.json(user);
} catch (error: any){
  console.log(error, 'REGISTRATION_ERROR')
}
}