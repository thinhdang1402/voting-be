import { IsNotEmpty, IsString, Matches } from 'class-validator'

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone: string
}
