import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

import { User } from './users.entity'

@Schema({ versionKey: false, timestamps: true, autoIndex: true })
export class RefreshToken {
  @Prop({ required: true, index: true, unique: true })
  token: string
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  userId: Types.ObjectId
  @Prop({ required: true })
  expiredAt: Date
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)
