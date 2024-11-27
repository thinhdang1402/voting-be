import { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  phone: string
  email: string
  role: RoleType
  username: string
  password: string
  type: UserType
  address: UserAddress
  sex: string
  age: number
  position?: string
  fullName: string
  description?: string
  extraInfo?: any
  createdAt?: any
  updatedAt?: any
}

export interface UserAddress {
  city: string
  district?: string
  ward?: string
  fullAddress?: string
}

export enum RoleType {
  Admin = 'admin',
  User = 'user',
}

export enum UserType {
  Voter = 'voter',
  Candidate = 'candidate',
}
