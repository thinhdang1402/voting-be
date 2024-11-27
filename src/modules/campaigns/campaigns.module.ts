import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Campaign, CampaignSchema } from './entities/campaigns.entities'
import { CampaignsController } from './campaigns.controller'
import { CampaignsService } from './campagins.service'
import { UserSchema } from 'modules/users/entities/users.entity'
import { User } from 'modules/users/entities/users.entity'
import { VotingSchema } from './entities/voting.entities'
import { Voting } from './entities/voting.entities'
import { VotingService } from './voting.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Campaign.name, schema: CampaignSchema },
      { name: Voting.name, schema: VotingSchema },
    ]),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, VotingService],
  exports: [],
})
export class CampaignsModule {}
