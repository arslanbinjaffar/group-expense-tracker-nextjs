// Define the enum for Category
export enum Category {
    Travel = "Travel",
    OfficeSupplies = "OfficeSupplies",
    Marketing = "Marketing"
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
  }
  
  export interface Membership {
    id: string;
    userId: string;
    groupId: string;
    user: User;
    group?: Group;
  }
  
  export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: Category;
    userId: string;
    groupId: string;
    createdBy: User;
  }
  
  export interface Group {
    id: string;
    name: string;
    description: string;
    adminId: string;
    admin: User;
    memberships: Membership[];
    expenses: Expense[];
  }
  