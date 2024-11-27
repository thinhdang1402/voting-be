import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Date } from 'mongoose'
import { IVoting } from '../voting.type'

@Schema()
export class Voting implements IVoting {
  @Prop()
  candidateId: string

  @Prop()
  userId: string

  @Prop()
  campaignId: string

  @Prop({ type: Date, default: Date.now })
  createdAt: Date

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date
}

export const VotingSchema = SchemaFactory.createForClass(Voting)
