import { IsString } from 'class-validator'

export class VoteDto {
  @IsString()
  candidateId: string

  @IsString()
  campaignId: string

  @IsString()
  userId: string
}
