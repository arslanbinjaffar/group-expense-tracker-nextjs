// app/api/groups/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/database/database"


export async function GET(request: Request) {
  try {
   
    const users = await prisma.user.findMany({
    });

   
    return NextResponse.json(users, { status: 200});
  } catch (error) {
    console.error('Error creating users:', error);
    return NextResponse.json({ error: 'Failed to create users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
 

    const user = await prisma.user.create({
      data,
    });


    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user',message:JSON.stringify(error) }, { status: 500 });
  }
}
