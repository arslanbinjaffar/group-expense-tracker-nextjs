'use client'
import React, { useState, useEffect } from 'react'
import { Group, Membership, Expense, Category } from '@/app/utils/type'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchGroupDetails, createExpense,deleteExpense } from '@/sevices/server'
import Link from 'next/link'
import Loader from '@/components/loader'
import { toast } from 'react-toastify'

const GroupDetailPage = ({ params }: { params: { groupId: string } }) => {
  const groupId = params.groupId
  const [isLoading,setIsLoading]=useState(false)
  const [group, setGroup] = useState<Group | null>(null)
  const [expenseDescription, setExpenseDescription] = useState('')
  const [expenseAmount, setExpenseAmount] = useState<number>(0)
  const [expenseCategory, setExpenseCategory] = useState<string>(Category.Travel)
  const [openExpenseModal, setOpenExpenseModal] = useState(false)
  async function loadGroup() {
    try {
      setIsLoading(true)
      const data = await fetchGroupDetails(groupId)
      setGroup(data)
      setIsLoading(false)
      toast.success("successfully fetch group details")
    } catch (error) {
      console.error('Error fetching group details:', error)
      setIsLoading(false)
      toast.error("Error adding member:" + JSON.stringify((error as any)?.message))
    }
  }
  useEffect(() => {
    loadGroup()
  }, [groupId])

  if (!group || isLoading) {
    return (
          <div className="flex justify-center items-center min-h-screen">
            <Loader/>
          </div>
    )
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
     await createExpense(group.id, {
        description: expenseDescription,
        amount: expenseAmount,
        category: expenseCategory,
        userId: group.adminId, 
        groupId: group.id,
      })
      setExpenseDescription('')
      setExpenseAmount(0)
      setExpenseCategory(Category.Travel)
      setOpenExpenseModal(false)
      toast.success("succesfully created expenses")
    } catch (error) {
      console.error('Error adding expense:', error)
      toast.error("Error adding member:" + JSON.stringify((error as any)?.message))

    } finally {
      loadGroup()
    }
  }
  const handleDeleteExpense = async (userId:string,expenseId:string) => {
  try {
    await deleteExpense(userId, expenseId)
    toast.success("succesfully deleted expenses")
    loadGroup()
  } catch (error) {
    console.log(error, "error")
    toast.error("Error adding member:" + JSON.stringify((error as any)?.message)) 
  } 
}
  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg">
          <div className='p-4 text-center'>
            <CardTitle className="text-3xl font-bold">{group.name}</CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              {group.description}
            </CardDescription>
          </div>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className='flex justify-between w-full'>
          <Link href={"/dashboard"}>
            <Button variant="outline" className="mt-4 md:mt-0">
              Dashboard
            </Button>
          </Link>
          <Link href={`${groupId}/settings`}>
            <Button variant="outline" className="mt-4 md:mt-0">
              Group Settings
            </Button>
          </Link>
          </div>
        </CardHeader>
        <CardContent>
          <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Members</h2>
            <ul className="space-y-2">
              {group.memberships.map((membership: Membership) => (
                <li
                  key={membership.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
                >
                  <span className="font-medium">{membership.user.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
            {group.expenses.length ? (
              <ul className="space-y-2">
                {group.expenses.map((expense: Expense) => (
                  <li
                    key={expense.id}
                    className="bg-gray-50 p-3 rounded shadow-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{expense.description}</span>
                      <span className="text-gray-700">${expense.amount.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{expense.category}</p>
                    <div className="justify-end flex space-x-3">
                    <Link href={`/expenses/${expense.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                      </Link>
                    <Button variant="destructive" size="sm" onClick={async()=> await  handleDeleteExpense(expense.userId,expense.id)}>
                      Delete
                    </Button>
                  </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No expenses added yet.</p>
            )}
          </section>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Dialog open={openExpenseModal} onOpenChange={setOpenExpenseModal}>
            <DialogTrigger asChild>
              <Button>Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
                <DialogDescription>
                  Enter details for the new expense.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddExpense} className="space-y-4 mt-4">
                <Input
                  type="text"
                  placeholder="Expense Description"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(parseFloat(e.target.value))}
                  required
                />
                <Select
                  value={expenseCategory}
                  onValueChange={(value:string) => setExpenseCategory(value as Category)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Category.Travel}>Travel</SelectItem>
                    <SelectItem value={Category.OfficeSupplies}>Office Supplies</SelectItem>
                    <SelectItem value={Category.Marketing}>Marketing</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setOpenExpenseModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Expense</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}

export default GroupDetailPage
