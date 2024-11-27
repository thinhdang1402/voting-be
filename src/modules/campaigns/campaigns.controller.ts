import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { CreateCampaignDto } from './dto/create-campaign.dto'
import { CampaignsService } from './campagins.service'
import { VotingService } from './voting.service'
import { VoteDto } from './dto/vote-dto'
import { CampaignStatus } from './campaigns.type'

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignsService,
    private readonly votingService: VotingService,
  ) {}

  @Get()
  async getCampaigns(
    @Query() query: { status: CampaignStatus; userId: string },
  ) {
    return await this.campaignService.getCampaigns(query)
  }

  @Get(':id')
  async getCampaign(@Param('id') id: string) {
    return await this.campaignService.getCampaign(id)
  }

  @Post()
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    console.log(createCampaignDto)
    return await this.campaignService.createCampaign(createCampaignDto)
  }

  @Post('vote')
  async vote(@Body() voteDto: VoteDto) {
    return await this.votingService.vote(voteDto)
  }
}
