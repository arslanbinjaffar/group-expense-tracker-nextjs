'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSpecificExpense, updateSpecificExpense } from '@/sevices/server'
import { Expense } from '@/app/utils/type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Loader from '@/components/loader'
import { toast } from 'react-toastify'

const ExpenseEditPage = ({ params }: { params: { expenseId: string } }) => {
  const router = useRouter()
  const expenseId = params.expenseId

  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [category, setCategory] = useState('Travel')

  useEffect(() => {
    async function fetchExpense() {
      try {
        const { expense }: { message: string; expense: Expense } = await getSpecificExpense(expenseId)
        setDescription(expense.description)
        setAmount(expense.amount)
        setCategory(expense.category)
        setUserId(expense.userId)
        toast.success("successfully fetch expenses")
      } catch (error) {
        console.error('Failed to fetch expense details', error)
        toast.error("Error adding member:" + JSON.stringify((error as any)?.message))
        
      } finally {
        setLoading(false)
      }
    }
    if (expenseId) {
      fetchExpense()
    }
  }, [expenseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updated = await updateSpecificExpense(userId, expenseId, {
        description,
        amount,
        category,
      })
      router.push('/expenses')
    } catch (error) {
      console.error('Failed to update expense', error)
      toast.error("Error adding member:" + JSON.stringify((error as any)?.message))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
      <Loader/>
    </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expense description"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Expense amount"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value)}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Travel">Travel</SelectItem>
                  <SelectItem value="OfficeSupplies">Office Supplies</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExpenseEditPage
