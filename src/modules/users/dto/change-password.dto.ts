import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class ChangePasswordDto {
  @IsString()
  oldPassword: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string
}