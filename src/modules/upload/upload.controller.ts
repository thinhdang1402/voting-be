// src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from 'guards/auth.guard'
import { AwsS3Service } from 'providers/aws-s3/aws-s3.service'

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private awsS3Service: AwsS3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.awsS3Service.uploadFile(file)
    return {
      url: result.Location,
      key: result.Key,
    }
  }
}
