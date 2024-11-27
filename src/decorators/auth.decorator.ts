import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'

export type IAuth = {
  userId: string
}
export const RequestAuth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>()
    const {
      headers: { userId },
    } = request
    if (!userId)
      throw new UnauthorizedException('Missing userId in request headers')

    return {
      userId,
      userAgent: request.headers['user-agent'],
    }
  },
)
