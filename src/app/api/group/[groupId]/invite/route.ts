// app/api/groups/[groupId]/invite/route.ts
import { NextResponse } from 'next/server';
import prisma from "@/database/database"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { groupId } = await params;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the user is already a member of the group
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_groupId: { userId: user.id, groupId },
      },
    });
    if (existingMembership) {
      return NextResponse.json({ error: 'User already a member' }, { status: 400 });
    }

    // Create the membership
    const membership = await prisma.membership.create({
      data: { userId: user.id, groupId },
    });

    return NextResponse.json(membership, { status: 201 });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json({ error: 'Failed to invite user' }, { status: 500 });
  }
}
