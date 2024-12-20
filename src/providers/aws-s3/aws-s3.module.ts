import { Module } from '@nestjs/common'
import { AwsS3Service } from './aws-s3.service'

@Module({
  imports: [],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsModule {}
