import { IsOptional, IsString, IsEmail } from 'class-validator'
import { IsDateFormat } from 'validators/time.validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  phone: string

  @IsString()
  @IsDateFormat({ message: 'Date must be in the format "dd/mm/yyyy' })
  @IsOptional()
  dateOfBirth: string

  @IsEmail()
  @IsOptional()
  email: string
}
