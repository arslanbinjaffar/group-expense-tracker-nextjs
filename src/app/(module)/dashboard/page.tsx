"use client"
import React, { useState, useEffect } from 'react'
import { Group } from '@/app/utils/type'
import { getAllGroups } from '@/sevices/server'
import dynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createGroup } from '@/sevices/server'
import { useAuth } from '@/app/_Providers/AuthProvider'
import Loader from '@/components/loader'
import { toast } from 'react-toastify'
const GroupRow = dynamic(() => import('@/components/GroupRow'), { ssr: false })

const Page = () => {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading,setLoading]=useState(false)
  const fetchGroups = async () => {
    try {
      setLoading(true)
      const data: Group[] = (await getAllGroups()) || []
      setGroups(data)
      setLoading(false)
      toast.success("successfully fetched all groups")      
    } catch (error) {
      setLoading(false)
      toast.error("Error adding member:" + JSON.stringify((error as any)?.message))
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader/>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Groups</h2>
          <AddGroupModal onGroupAdded={fetchGroups} />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left">Group Name</th>
                <th className="py-3 px-6 text-left">Description</th>
                <th className="py-3 px-6 text-left">Admin</th>
                <th className="py-3 px-6 text-center">Members</th>
                <th className="py-3 px-6 text-center">Expenses</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groups.length>0 &&groups.map((group: Group) => (
                <GroupRow
                  key={group.id}
                  group={group}
                  onGroupUpdated={fetchGroups}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page



type AddGroupModalProps = {
  onGroupAdded: () => void
}

const AddGroupModal = ({ onGroupAdded }: AddGroupModalProps) => {
  const [open, setOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const {dbUser} = useAuth()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
    const data=  await createGroup({
        name: groupName,
        description: groupDescription,
        adminId:dbUser.id,
    })
      toast.success("successfully added new group")
    } catch (error) {
      toast.error("Error adding group:" + JSON.stringify((error as any)?.message))
    } finally {
      setOpen(false)
      setGroupName('')
      setGroupDescription('')
      onGroupAdded()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="capitalize">Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
          <DialogDescription>
            Enter details for the new group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Group Description"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Group</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}







