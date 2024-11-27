import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { Model } from 'mongoose'

import { SignUpDto } from '../dto/sign-up.dto'
import { SignInDto } from '../dto/sign-in.dto'
import { ChangePasswordDto } from '../dto/change-password.dto'
import { ForgotPasswordDto } from '../dto/forgot-password.dto'
import { AuthGuard } from 'guards/auth.guard'
import { AuthService } from '../services/auth.service'
import { RefreshTokenDto } from '../dto/refresh-token.dto'
import { SmsService } from 'providers/sms/sms.service'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '../entities/users.entity'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto)
  }

  @Post('/sign-in')
  async signIn(@Body() loginDto: SignInDto) {
    return await this.authService.signIn(loginDto)
  }

  // @Post('/sign-out')
  // @UseGuards(AuthGuard)
  // // @OnEvent('sign-out')
  // async signOut(@Req() req) {
  //   return await this.userModel.findByIdAndUpdate(
  //     req.userId,
  //     { isVerified: false },
  //     { new: true, upsert: true },
  //   )
  // }

  // @Post('/send-otp')
  // async sendOtp(@Body('phone') phone: string) {
  //   const user = await this.userModel.findOne({ phone })
  //   if (!user) throw new BadRequestException('User not found')
  //   await this.smsService.sendOtp(phone)
  //   return user
  // }

  // @Post('/verify-otp')
  // async verify(@Body() { phone, code }: { phone: string; code: string }) {
  //   const user = await this.userModel.findOne({ phone })
  //   if (!user) throw new BadRequestException('User not found')
  //   const verification = await this.smsService.verifyOtp(phone, code)
  //   if (!verification.valid) throw new BadRequestException('Invalid OTP')
  //   const verifiedUser = await this.userModel.findOneAndUpdate(
  //     { phone },
  //     { isVerified: true },
  //     { new: true, upsert: true },
  //   )
  //   return verifiedUser
  // }

  // @Post('refresh')
  // async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
  //   return this.authService.refreshTokens(refreshTokenDto.refreshToken)
  // }

  // @UseGuards(AuthGuard)
  // @Patch('change-password')
  // async changePassword(
  //   @Body() changePasswordDto: ChangePasswordDto,
  //   @Req() req,
  // ) {
  //   return this.authService.changePassword(
  //     req.userId,
  //     changePasswordDto.newPassword,
  //     changePasswordDto.oldPassword,
  //   )
  // }

  // @Post('forgot-password')
  // async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(forgotPasswordDto.phone)
  // }
}
