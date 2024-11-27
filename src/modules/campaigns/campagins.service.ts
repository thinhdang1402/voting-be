import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { Campaign } from './entities/campaigns.entities'
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { User } from 'modules/users/entities/users.entity'
import { UserType } from 'modules/users/users.type'
import { CampaignStatus } from './campaigns.type'
import { Voting } from './entities/voting.entities'

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
    @InjectModel(Voting.name) private votingModel: Model<Voting>,
  ) {}

  async getCampaign(id: string) {
    const campagin = await this.campaignModel.findById(id)
    const voting = await this.votingModel.find({ campaignId: id })

    const districts = campagin.regions.flatMap((region) => region.districts)
    const query: any = {
      'address.city': { $in: campagin.regions.map((region) => region.city) },
    }

    if (districts.length > 0) {
      query['address.district'] = { $in: districts }
    }

    const votersInRegion = await this.userModel.find(query)

    const filterVoters = votersInRegion.map((voter) => {
      return {
        ...voter.toObject(),
        voted: voting.map((v) => v.userId).includes(voter._id.toString()),
      }
    })

    const candidates = await this.userModel.find({
      _id: { $in: campagin.candidateIds },
    })

    const regions = campagin.regions.map((region) => {
      const totalVoters = filterVoters.filter(
        (voter) => voter.address.city === region.city,
      ).length

      const totalVoted = filterVoters
        .filter((item) => item.voted)
        .filter((voter) => voter.address.city === region.city).length
      return {
        city: region.city,
        totalVoted,
        totalVoters,
      }
    })

    return {
      ...campagin.toObject(),
      regions,
      candidates,
      voters: filterVoters,
    }
  }

  async getCampaigns(query: { status: CampaignStatus; userId: string }) {
    const user = await this.userModel.findOne({ _id: query.userId })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const queryStatus = query.status ? { status: query.status } : {}
    const campaigns = await this.campaignModel
      .find(queryStatus)
      .sort({ createdAt: -1 })

    const filterCampaigns = campaigns.map((campaign) => {
      const city = campaign.regions.map((region) => region.city)
      const district = campaign.regions.flatMap((region) => region.districts)
      return {
        ...campaign.toObject(),
        canVote:
          city.includes(user.address.city) &&
          district.includes(user.address.district),
      }
    })

    return filterCampaigns
  }

  async isCandidate(candidateIds: string[]) {
    const candidateIdsObject = candidateIds.map((id) => new Types.ObjectId(id))
    const user = await this.userModel.find({
      _id: { $in: candidateIdsObject },
    })
    return user.every((user) => user.type === UserType.Candidate)
  }

  async createCampaign(createCampaignDto: CreateCampaignDto) {
    const { candidateIds } = createCampaignDto
    if (!(await this.isCandidate(candidateIds))) {
      throw new BadRequestException('User is not a candidate')
    }

    const regions = []
    let counts = 92
    while (counts > 0) {
      regions.push({
        city: counts < 10 ? '0' + counts.toString() : counts.toString(),
      })
      counts--
    }
    const campaign = await this.campaignModel.create({
      ...createCampaignDto,
      regions,
    })
    return {
      _id: campaign._id,
    }
  }

  async generateVoters(campaignId: string) {}
}
