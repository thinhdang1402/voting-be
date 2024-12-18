import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type VisitCountDocument = HydratedDocument<VisitCount>

@Schema({ timestamps: true })
export class VisitCount {
  @Prop({ required: true, default: 0 })
  count: number

  @Prop({ required: true })
  path: string

  createdAt: Date
  updatedAt: Date
}

export const VisitCountSchema = SchemaFactory.createForClass(VisitCount)
