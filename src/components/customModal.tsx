import React, { FC, ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog'
interface Props{
    isOpenModal: boolean
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    children:ReactNode
  }
const CustomModal:FC<Props> = ({isOpenModal,setIsOpenModal,title,children}) => {
  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
    <DialogTrigger asChild>
      <button className="mt-2 text-blue-500 hover:underline text-xs">
        {title}
      </button>
    </DialogTrigger>
    <DialogContent>
   {children}
    </DialogContent>
  </Dialog>
  )
}

export default CustomModal