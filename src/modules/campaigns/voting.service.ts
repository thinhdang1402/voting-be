import { BadRequestException, NotFoundException } from '@nestjs/common'
import { VoteDto } from './dto/vote-dto'
import { InjectModel } from '@nestjs/mongoose'
import { Voting } from './entities/voting.entities'
import { Model } from 'mongoose'
import { User } from 'modules/users/entities/users.entity'
import { Campaign } from './entities/campaigns.entities'
import { UserType } from 'modules/users/users.type'
import { CampaignStatus } from './campaigns.type'
import { ConfigService } from '@nestjs/config'

export class VotingService {
  constructor(
    @InjectModel(Voting.name) private votingModel: Model<Voting>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    private readonly configService: ConfigService,
  ) {}

  async isValidCampaign(campaignId: string) {
    const campaign = await this.campaignModel.findById(campaignId)
    if (!campaign) {
      throw new NotFoundException('Campaign not found')
    }
    if (campaign.status === CampaignStatus.INACTIVE) {
      throw new BadRequestException('Campaign is not active')
    }
    return true
  }

  async isUserCanVote(userId: string, campaignId: string) {
    const user = await this.userModel.findOne({
      _id: userId,
    })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    if (user.type !== UserType.Voter) {
      throw new BadRequestException('User is not a voter')
    }
    await this.isValidCampaign(campaignId)
    const campaign = await this.campaignModel.findById(campaignId)
    const city = campaign.regions.map((region) => region.city)
    const district = campaign.regions.flatMap((region) => region.districts)
    if (
      !city.includes(user.address.city) ||
      (district.length > 0 && !district.includes(user.address.district))
    ) {
      throw new BadRequestException('User is not in the campaign region')
    }

    return true
  }

  async vote(voteDto: VoteDto) {
    const { candidateId, campaignId, userId } = voteDto
    await this.isUserCanVote(userId, campaignId)
    const voting = await this.votingModel.findOne({
      campaignId,
      userId,
    })

    if (voting) {
      throw new BadRequestException('User already voted')
    }

    const newVoting = await this.votingModel.create({
      candidateId,
      campaignId,
      userId,
    })
    const time = newVoting.createdAt

    const kafkaUrl = this.configService.get('kafka.url')
    const voter = await this.userModel.findOne({
      _id: userId,
    })
    const candidate = await this.userModel.findOne({
      _id: candidateId,
    })
    const campaign = await this.campaignModel.findOne({
      _id: campaignId,
    })
    const voterName = voter?.fullName
    const candidateName = candidate?.fullName
    const campaignName = campaign?.name

    try {
      await fetch(`${kafkaUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          fromID: userId,
          toID: userId,
          message: `Chiến dịch ${campaignName}: ${voterName} đã bầu cho ứng cử viên ${candidateName} vào lúc ${time}`,
        }),
      })
    } catch (error) {
      console.error('Error:', error)
    }
    return {
      message: 'Vote successful',
    }
  }
}
