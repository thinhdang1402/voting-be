import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { VisitCount } from './entities/visit-count.entity'
import { SocketService } from 'modules/socket/socket.service'
import { LogsService } from '../logs/logs.service'
import { LogType } from '../logs/entities/log.entity'

@Injectable()
export class AnalyticsGateway {
  constructor(
    @InjectModel(VisitCount.name) private visitCountModel: Model<VisitCount>,
    private readonly socketService: SocketService,
    private readonly logsService: LogsService,
  ) {}

  async trackVisit(path: string) {
    const visit = await this.visitCountModel.findOneAndUpdate(
      { path },
      { $inc: { count: 1 } },
      { upsert: true, new: true },
    )

    await this.logsService.createLog(LogType.VIEW_PAGE, 'VIEW_PAGE', {
      path,
      count: visit.count,
    })

    this.socketService.emit('visitUpdate', {
      path: visit.path,
      count: visit.count,
      date: visit.createdAt,
    })

    return visit
  }

  async getVisitCounts() {
    return this.visitCountModel.find()
  }
}
