import { Types } from 'mongoose'

export interface ICampaign {
  _id: Types.ObjectId
  name: string
  description?: string
  thumbnail?: string
  startDate: number
  endDate: number
  status: CampaignStatus
  regions: CampaignRegion[]
  candidateIds: string[]
  createdAt?: any
  updatedAt?: any
}

export interface CampaignRegion {
  city: string
  districts: string[]
}

export enum CampaignStatus {
  ACTIVE = 0,
  INACTIVE = 1,
}
