import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { CampaignRegion, CampaignStatus, ICampaign } from '../campaigns.type'

export type CampaignDocument = HydratedDocument<Campaign>

@Schema({ autoIndex: true, timestamps: true })
export class Campaign implements ICampaign {
  _id: Types.ObjectId

  @Prop({ required: true, index: true })
  name: string

  @Prop()
  description: string

  @Prop({ required: true })
  startDate: number

  @Prop({ required: true })
  endDate: number

  @Prop({ type: Number, enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  status: CampaignStatus

  @Prop({ type: [{ city: String, districts: [String] }] })
  regions: CampaignRegion[]

  @Prop()
  thumbnail: string

  @Prop({ type: [String] })
  candidateIds: string[]
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)
