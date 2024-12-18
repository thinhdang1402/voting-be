import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller'
import configuration from './configs/configuration'
import { AppService } from 'app.service'
import { UserModule } from 'modules/users/users.module'
import { UploadModule } from 'modules/upload/upload.module'
import { AwsModule } from 'providers/aws-s3/aws-s3.module'
import { ScheduleModule } from '@nestjs/schedule'
import { CampaignsModule } from 'modules/campaigns/campaigns.module'
import { AnalyticsModule } from 'modules/analytics/analytics.module'
import { SocketModule } from 'modules/socket/socket.module'
import { LogsModule } from 'modules/logs/logs.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret', { infer: true }),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get<string>('mongodb.uri', { infer: true }),
        }
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({ wildcard: true }),
    UserModule,
    UploadModule,
    AwsModule,
    CampaignsModule,
    AnalyticsModule,
    SocketModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
