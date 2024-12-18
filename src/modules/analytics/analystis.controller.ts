import { Controller, Get, Post, Param } from '@nestjs/common'
import { AnalyticsGateway } from './analytics.gateway'

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsGateway: AnalyticsGateway) {}

  @Post('track/:path')
  async trackVisit(@Param('path') path: string) {
    return this.analyticsGateway.trackVisit(path)
  }

  @Get()
  async getVisitCounts() {
    return this.analyticsGateway.getVisitCounts()
  }
}
