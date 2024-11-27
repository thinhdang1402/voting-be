import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

import { IUser, RoleType, UserAddress, UserType } from '../users.type'

export type UserDocument = HydratedDocument<User>

@Schema({ autoIndex: true, timestamps: true })
export class User implements IUser {
  _id: Types.ObjectId

  @Prop({ type: String, index: true, required: true, unique: true })
  username: string

  @Prop({ type: String, required: true, index: true })
  phone: string

  @Prop({ type: String, required: true, index: true, unique: true })
  email: string

  @Prop({ type: String, required: true })
  password: string

  @Prop({ type: String, default: RoleType.User })
  role: RoleType

  @Prop({ type: String, default: UserType.Voter })
  type: UserType

  @Prop({
    type: Object,
    required: true,
  })
  address: UserAddress

  @Prop({ type: String, required: true })
  fullName: string

  @Prop({ type: String, required: true })
  sex: string

  @Prop({ type: Number, required: true })
  age: number

  @Prop({ type: String, required: false })
  description: string

  @Prop({ type: Object, required: false })
  extraInfo: any

  createdAt?: any
  updatedAt?: any
}

export const UserSchema = SchemaFactory.createForClass(User)
