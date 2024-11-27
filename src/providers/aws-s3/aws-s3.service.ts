// src/aws/aws-s3.service.ts
import { Injectable } from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from 'configs/configuration'

@Injectable()
export class AwsS3Service {
  private s3: AWS.S3

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    const awsConfig = this.configService.get('aws')
    AWS.config.update({
      accessKeyId: awsConfig.accessKeyId,
      secretAccessKey: awsConfig.secretAccessKey,
      region: awsConfig.region,
    })

    this.s3 = new AWS.S3()
  }

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const { originalname, buffer } = file
    const Bucket = this.configService.get('aws').bucketName

    return this.s3
      .upload({
        Bucket,
        Key: `uploads/images/${Date.now()}-${originalname}`,
        Body: buffer,
        ContentType: 'image/jpeg',
        // ACL: 'public-read',
      })
      .promise()
  }
}
