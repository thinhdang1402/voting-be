import { Date } from 'mongoose'

export interface IVoting {
  candidateId: string
  userId: string
  campaignId: string
  createdAt: Date
  updatedAt: Date
}
