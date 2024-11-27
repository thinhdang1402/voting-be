import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class CampaignRegionDto {
  @IsNotEmpty()
  @IsString()
  city: string

  @IsNotEmpty()
  @IsArray()
  districts: string[]
}

export class CreateCampaignDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  thumbnail: string

  @IsNotEmpty()
  @IsNumber()
  startDate: number

  @IsNotEmpty()
  @IsNumber()
  endDate: number

  // @IsNotEmpty()
  // @IsArray()
  // // @Type(() => CampaignRegionDto)
  // regions: CampaignRegionDto[]

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  candidateIds: string[]
}
