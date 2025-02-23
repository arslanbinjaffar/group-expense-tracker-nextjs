import { Group } from "@/app/utils/type"
import axios from "axios"
interface UserDataType{
    email: string
    password: string
    name:string
}
export const createUser = async (data:UserDataType) => {
    try {
        const { data:user } = await axios.post("api/auth/user", data)
        return user
    } catch (error) {
        console.log(error,"error")
        return error
    }
}


export const getAllGroups = async () => {
  'use cache'
        const {data} = await axios.get("/api/group")
        return data
     
}

export const getSpecificExpense = async (expenseId:string) => {
    try {
        const {data} = await axios.get(`/api/expenses/${expenseId}`)
        return data
        
    } catch (error) {
        console.log(error, "error")
        return error
    }
}
interface updateGroupDataType extends Group{
    name: string
    adminId: string
    description:string
}
export const updateSpecificGroup =async (groupId:string,data:any) => {
    try {
        const { data: updated } = await axios.patch(`api/group/${groupId}`,data)
        return updated
    } catch (error) {
        console.log(error, "error")
        return error
    }
}
export const deleteSpecificGroup =async (groupId:string,data:any) => {
        const { data: deleted } = await axios.post(`api/group/${groupId}`,data)
        return deleted
  
}

export const updateSpecificExpense = async (userId:string,expenseId: string, data: any) => {
    try {
        const { data: updated } = await axios.patch(`/api/expenses/${expenseId}`, data, {
            headers: {
                "x-user-id":userId
            }
        })
        return updated
    } catch (error) {
        console.log(error, "error")
        return error
    }
}

export const createGroup = async (data:any) => {
    try {
        const group = await axios.post("/api/group", data)
        console.log(group, "group")
        return group
    } catch (error) {
        console.log(error, "error") 
        return error
    }
}


export const createExpense = async (groupId:string,data: any) => {
    try {
        const expense = await axios.post(`/api/expenses/group/${groupId}`, data)
        console.log(expense)

    } catch (error) {
        console.log(error, "error")
        return error
    }
}

export const fetchGroupDetails = async (groupId:string) => {
    try {
        const { data: group } = await axios.get(`/api/group/${groupId}`)
        return group
    } catch (error) {
        console.log(error, "error")
        return error
    }
}


export const InvitedNewMemeberInGroup = async (email:string,groupId:string) => {
        const { data: Invited } = await axios.post(`/api/group/${groupId}/invite`, { email })
        return Invited;
}

export const deleteExpense = async(userId:string,expenseId:string) => {
        const {data}=await axios.delete(`/api/expenses/${expenseId}?userId=${userId}`)
        return data
  
}


export const deleteMemeberByGroupAdmin = async ({ adminId,groupId,memeberId,userId}:{adminId:string,memeberId: string,groupId:string, userId: string}) => {
    
    const { data: deletedMemeber } = await axios.post(`http://localhost:3000/api/group/${groupId}/memebers/${userId}?groupId=${groupId}&memeberId=${memeberId}`, {
     
    })
    return deletedMemeber
}