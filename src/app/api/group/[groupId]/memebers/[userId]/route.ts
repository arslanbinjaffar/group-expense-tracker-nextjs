// app/api/groups/[groupId]/members/[userId]/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/database/database"

export async function POST(
  request: Request,
  { params }: { params: Promise<{userId:string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const memeberId = searchParams.get('memeberId');
    const groupId = searchParams.get('groupId');
    if (!memeberId) {
      return NextResponse.json({ error: 'memeberId is required' }, { status: 400 });
    }
    if (!groupId) {
      return NextResponse.json({ error: 'groupId is required' }, { status: 400 });
    }

   

  

    await prisma.membership.delete({
      where: {
        id:memeberId,
        userId_groupId: { userId, groupId },
      },
    });

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}


export async function GET(
  request: Request,
  { params }: { params: Promise<{userId:string }> }
) {
  try {
    return NextResponse.json({ message: 'Member removed successfully',url:request.url });
  } catch (error) {
    console.error('Error removing member:', error);
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 });
  }
}
