// app/api/expenses/[expenseId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/database/database"
export async function PATCH(
  request: NextRequest,
  { params }: { params:Promise< { expenseId: string }>  }
) {
  try {
    const { expenseId } =await params;
    const { description, amount, category } = await request.json();
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User ID required' }, { status: 401 });
    }
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    if (expense.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Not the creator' }, { status: 403 });
    }
    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data: { description, amount, category },
    });

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params:Promise< { expenseId: string }>  }
) {
  try {
    const { expenseId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User ID required' }, { status: 401 });
    }
    const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
    if (!expense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    if (expense.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Not the creator' }, { status: 403 });
    }
    await prisma.expense.delete({ where: { id: expenseId } });
    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}



export const GET = async (  request: NextRequest,{ params }: { params:Promise< { expenseId: string }> }) => {
  try {
    const { expenseId } = await params;
    const expense = await prisma.expense.findUnique({ where: { id: expenseId} });
    return NextResponse.json({ message: 'Expense deleted successfully',expense });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to fetch expense' }, { status: 500 });
    
  }
}