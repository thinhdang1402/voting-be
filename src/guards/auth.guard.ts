import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  ForbiddenException,
  Next,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from 'decorators/roles.decorator'
import { RoleType } from 'modules/users/users.type'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private eventEmitter: EventEmitter2,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Invalid token')
    }

    try {
      const payload = this.jwtService.verify(token)
      request.userId = payload.sub

      if (requiredRoles) {
        const hasRole = this.matchRoles(requiredRoles, payload.role)
        if (!hasRole) {
          throw new ForbiddenException('Invalid permissions')
        }
      }
    } catch (e) {
      Logger.error(e.message)
      throw new UnauthorizedException('Invalid Token')
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1]
  }

  private matchRoles(requiredRoles: string[], userRole: string[]) {
    return requiredRoles.some((role: string) => userRole?.includes(role))
  }
}
