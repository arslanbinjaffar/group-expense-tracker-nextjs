import { NextResponse } from 'next/server';
import prisma from "@/database/database"


export async function GET(request: Request) {
  try {
   
    const groups = await prisma.group.findMany({
      include: {
        admin: true,
        memberships: {
          include: { user: true },
        },
        expenses: true,
      },
    })

   
    return NextResponse.json(groups, { status: 200});
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.adminId) {
      return NextResponse.json({ error: 'adminId is required' }, { status: 400 });
    }

    const group = await prisma.group.create({
      data,
    });

    await prisma.membership.create({
      data: {
        userId: data.adminId,
        groupId: group.id,
        },
    });

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}
