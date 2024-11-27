// src/upload/upload.module.ts
import { Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { AwsModule } from 'providers/aws-s3/aws-s3.module'

@Module({
  imports: [AwsModule],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
