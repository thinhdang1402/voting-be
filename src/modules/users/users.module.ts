import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthController } from './controllers/auth.controller'
import { User, UserSchema } from './entities/users.entity'
import { AuthService } from './services/auth.service'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'
import {
  RefreshToken,
  RefreshTokenSchema,
} from './entities/refresh-token.entity'
import { SmsService } from 'providers/sms/sms.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, SmsService],
  exports: [],
})
export class UserModule {}
