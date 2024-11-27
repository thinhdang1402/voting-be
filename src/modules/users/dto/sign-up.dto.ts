import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { UserAddress, UserType } from '../users.type'
// import { IsDateFormat } from 'validators/time.validator'

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsObject()
  // @IsNotEmpty()
  address: UserAddress

  @IsOptional()
  @IsString()
  @IsEnum(UserType)
  type: UserType

  @IsOptional()
  @IsString()
  fullName: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsObject()
  extraInfo: any

  @IsString()
  sex: string

  @IsNumber()
  age: number
}
