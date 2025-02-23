import React, { useState } from 'react'
import { Group, Membership, Expense } from '@/app/utils/type'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { deleteSpecificGroup, updateSpecificGroup } from '@/sevices/server'
import { toast } from 'react-toastify'
type GroupRowProps = {
    group: Group
    onGroupUpdated: () => void
}

const GroupRow: React.FC<GroupRowProps> = ({ group,onGroupUpdated }) => {
 const router=useRouter()
    const handleDeleteGroup =async () => {
    try {
      const data = await deleteSpecificGroup(group.id,{adminId:group.adminId})
      toast.success("successfully delete group")
      onGroupUpdated()
    } catch (error) {
      toast.error("you don't premission to delete:" + JSON.stringify((error as any)?.message))
    } 
}

  return (
    <>
      <tr key={group.id} className="text-center border-b hover:bg-gray-50">
        <td className="py-4 px-6">{group.name}</td>
        <td className="py-4 px-6">{group.description}</td>
        <td className="py-4 px-6">{group.admin.name}</td>
        <td className="py-4 px-6">
          {group.memberships.map((membership: Membership) => (
            <div key={membership.id} className="text-sm">
              {membership.user.name}
            </div>
          ))}
        </td>
        <td className="py-4 px-6">
          {group.expenses.map((expense: Expense) => (
            <div key={expense.id} className="text-sm">
              {expense.description} - ${expense.amount.toFixed(2)}
            </div>
          ))}
                  
              </td>
              <td className="py-3 px-6 text-center space-x-2">
          <Button variant="outline" size="sm" onClick={()=>router.push(`groups/${group.id}`)}>View</Button>
        <EditGroupModal group={group} onGroupUpdated={onGroupUpdated} />
        <Button variant="destructive" size="sm" onClick={handleDeleteGroup}>
          Delete
        </Button>
      </td>
          </tr>
            
    </>
  )
}

export default GroupRow


type EditGroupModalProps = {
    group: Group
    onGroupUpdated: () => void
  }
  
  const EditGroupModal = ({ group, onGroupUpdated }: EditGroupModalProps) => {
    const [open, setOpen] = useState(false)
    const [groupName, setGroupName] = useState(group.name)
    const [groupDescription, setGroupDescription] = useState(group.description)
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await updateSpecificGroup(group.id, { name: groupName, description: groupDescription })
      } catch (error) {
        console.error('Error updating group:', error)
      } finally {
          setOpen(false)
        onGroupUpdated()
          
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>
              Modify the group details.
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
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
}
  

