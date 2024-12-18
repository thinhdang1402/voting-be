import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AnalyticsGateway } from './analytics.gateway'
import { VisitCount, VisitCountSchema } from './entities/visit-count.entity'
import { AnalyticsController } from './analystis.controller'
import { SocketModule } from 'modules/socket/socket.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitCount.name, schema: VisitCountSchema },
    ]),
    SocketModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsGateway],
  exports: [AnalyticsGateway],
})
export class AnalyticsModule {}
