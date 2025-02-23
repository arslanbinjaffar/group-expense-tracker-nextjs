'use client'
import React, { useState, useEffect } from 'react'
import { Group, Membership } from '@/app/utils/type'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteMemeberByGroupAdmin, fetchGroupDetails, InvitedNewMemeberInGroup } from '@/sevices/server'
import { toast } from 'react-toastify'
import Loader from '@/components/loader'
import { useAuth } from '@/app/_Providers/AuthProvider'

const GroupDetailPage = ({ params }: { params: { groupId: string } }) => {
  const groupId = params.groupId
  const [group, setGroup] = useState<Group | null>(null)
  const [isLoading,setIsLoading]=useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isOpenModal,setIsOpenModal]=useState(false)
  async function loadGroup() {
    try {
      setIsLoading(true)
      const data = await fetchGroupDetails(groupId)
      setGroup(data)
      setIsLoading(false)
      toast.success("fetching group settings")
    } catch (error) {
      console.error('Error fetching group details:', error)
      setIsLoading(false)
      toast.error("Error fetching group details:"+JSON.stringify(error))
    }
  }
  useEffect(() => {
    loadGroup()
  }, [groupId])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const member = await InvitedNewMemeberInGroup(newMemberEmail, groupId)
      toast.success("sucessfully added new memeber")
    } catch (error) {
      console.error('Error adding member:', error)
      toast.error("Error adding member:" + JSON.stringify((error as any)?.message))
    }
    setNewMemberEmail('')
    loadGroup()
    setIsOpenModal(false)

  }

  if (!group || isLoading) {
    return (
          <div className="flex justify-center items-center min-h-screen">
            <Loader/>
          </div>
    )
  }
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 capitalize">group settings</h2>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{group.name}</CardTitle>
          <p className="text-gray-600 mt-2">{group.description}</p>
        </CardHeader>
        <CardContent>
          <section className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Members</h2>
            <ul className="space-y-2">
              {group.memberships.map((membership: Membership) => (
                <Member key={membership.id} membership={membership} />
              ))}
            </ul>
          </section>
          <div className="mt-8 flex justify-end">
            <AddMemberModal 
              handleAddMember={handleAddMember} 
              newMemberEmail={newMemberEmail} 
              setNewMemberEmail={setNewMemberEmail} 
              isOpenModal={isOpenModal}
              setIsOpenModal={setIsOpenModal}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GroupDetailPage

function Member({ membership }: { membership: Membership }) {
  const {dbUser}=useAuth()
  const handleDelete = async() => {
    try {
      const deleted = await deleteMemeberByGroupAdmin({adminId:dbUser?.id,memeberId:membership?.id,groupId:membership.groupId,userId: membership.userId})
      toast.success("successsfully deleted by group admin")
    } catch (error) {
      console.error('Error adding member:', error)
      toast.error("Error adding member:" + JSON.stringify((error as any)?.message))
    }
  }
  return (
    <li className="flex items-center justify-between bg-gray-50 p-4 rounded shadow-sm">
      <span className="font-medium">{membership.user.name}</span>
      <div className="space-x-2">
        <Button variant="outline" size="sm">Edit</Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
      </div>
    </li>
  )
}

function AddMemberModal({ 
  handleAddMember, 
  newMemberEmail, 
  setNewMemberEmail,
  isOpenModal,
  setIsOpenModal
}: { 
  handleAddMember: (e: React.FormEvent) => Promise<void>, 
  newMemberEmail: string, 
    setNewMemberEmail: React.Dispatch<React.SetStateAction<string>>,
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    isOpenModal: boolean
}) {
  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>
        <Button>Add Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the new member to send an invitation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddMember} className="space-y-4 mt-4">
          <Input
            type="email"
            placeholder="Member Email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Invite
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
