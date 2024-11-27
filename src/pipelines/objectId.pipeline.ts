import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { Types } from 'mongoose'

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(id: string | null) {
    try {
      if (id) return new Types.ObjectId(id)
    } catch (er: any) {
      throw new BadRequestException(er.message)
    }
  }
}

@Injectable()
export class ParseMongoIdsPipe implements PipeTransform {
  transform(ids: string[]) {
    try {
      if (!ids) throw new Error('ReadIds Empty')
      return ids.map((id) => new Types.ObjectId(id))
    } catch (er: any) {
      throw new BadRequestException(er.message)
    }
  }
}
