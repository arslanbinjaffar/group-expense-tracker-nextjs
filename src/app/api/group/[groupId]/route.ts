import prisma from "@/database/database"
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: Request,{params}:{params:Promise<{groupId:string}>}) {
    try {
       const {groupId}=await params
        const group = await prisma.group.findUnique({
            where: {
              id:groupId
          },
        include: {
          admin: true,
          memberships: {
            include: { user: true },
          },
          expenses: true,
        },
      })
  
     
      return NextResponse.json(group, { status: 200});
    } catch (error) {
      console.error('Error creating group:', error);
      return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
    }
  }
  

  export async function PATCH(request: Request,{params}:{params:Promise<{groupId:string}>}) {
      try {
        const data=await request.json()
       const {groupId}=await params
        const group = await prisma.group.update({
            where: {
              id:groupId
            },
            data,
        include: {
          admin: true,
          memberships: {
            include: { user: true },
          },
          expenses: true,
        },
      })
  
     
      return NextResponse.json(group, { status: 200});
    } catch (error) {
      console.error('Error updated group:', error);
      return NextResponse.json({ error: 'Failed to updated group' }, { status: 500 });
    }
}
  


export async function POST(request: NextRequest,{params}:{params:Promise<{groupId:string}>}) {
    try {
      const { groupId } = await params
      const data = await request.json()
      console.log(data,"data")
      const previousGroup = await prisma.group.findUnique({
        where: { id:groupId },
      });
      if (!previousGroup) {
        return NextResponse.json(
          { message: "Group does not exist" },
          { status: 400 }
        );
      }
      if (previousGroup.adminId !== data.adminId) {
        return NextResponse.json(
          { message: "Forbidden: only the group admin can delete this group" },
          { status: 403 }
        );
        
      }
      await prisma.membership.deleteMany({
        where: {
          groupId: groupId, 
        },
      });
        const group = await prisma.group.delete({
            where: {
            id: groupId,
              adminId:data.adminId
          },
      })
      return NextResponse.json(group, { status: 200});
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete group',message:error }, { status: 500 });
    }
  }
  