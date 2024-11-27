import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

import { User } from '../entities/users.entity'
import { SignUpDto } from '../dto/sign-up.dto'
import { SignInDto } from '../dto/sign-in.dto'
import { RefreshToken } from '../entities/refresh-token.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  public readonly WHITELIST_OTP = [
    '5623',
    '8371',
    '1948',
    '4567',
    '3021',
    '7839',
    '6194',
    '4270',
    '8916',
    '7352',
    '1428',
    '6754',
    '2085',
    '9347',
    '5016',
    '7832',
    '3469',
    '1207',
    '8943',
    '6735',
  ]

  async signUp(signUpData: SignUpDto) {
    const { username, password } = signUpData
    console.log('signUpData', signUpData)

    const user = await this.userModel.findOne({
      $or: [{ phone: username }, { username }],
    })
    if (user) throw new BadRequestException('Email already used')

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('hashedPassword', hashedPassword)
    const userResponse = await this.userModel.create({
      ...signUpData,
      password: hashedPassword,
    })

    return {
      userId: userResponse._id,
      otp: this.WHITELIST_OTP[
        Math.floor(Math.random() * this.WHITELIST_OTP.length)
      ],
    }
  }

  async verifyOtp(phone: string, otp: string) {
    const user = await this.userModel.findOne({ phone })
    if (!user) throw new NotFoundException('User not found')

    if (!this.WHITELIST_OTP.includes(otp))
      throw new BadRequestException('Invalid OTP')

    return true
  }

  async signIn(credentials: SignInDto) {
    const { username, password } = credentials
    const user = await this.userModel.findOne({
      $or: [{ phone: username }, { username }],
    })

    if (!user) throw new UnauthorizedException('Wrong credentials')

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new UnauthorizedException('Wrong credentials')

    //Generate JWT tokens
    const tokens = await this.generateUserTokens(user._id.toString())
    return { ...tokens, userId: user._id }
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiredAt: { $gte: new Date() },
    })

    if (!token) {
      throw new UnauthorizedException('Refresh Token is invalid')
    }
    return this.generateUserTokens(token.userId.toString())
  }

  async changePassword(userId, newPassword: string, oldPassword = '') {
    const user = await this.userModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    const passwordMatch = await bcrypt.compare(oldPassword, user.password)
    if (oldPassword && !passwordMatch)
      throw new BadRequestException('Old password is incorrect!')

    const newHashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = newHashedPassword
    return await user.save()
  }

  async forgotPassword(phone: string) {
    const user = await this.userModel.findOne({ phone })
    if (!user) throw new NotFoundException('User not found')

    //todo
  }

  async generateUserTokens(userId: string) {
    const user = await this.userModel.findById(userId)
    const payload = { sub: userId, username: user.username, role: user.role }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2 days' })
    const refreshToken = uuidv4()

    await this.storeRefreshToken(refreshToken, userId)
    return {
      accessToken,
      refreshToken,
    }
  }

  async storeRefreshToken(token: string, userId: string) {
    // Calculate expiry date 7 days from now
    const expiredAt = new Date()
    expiredAt.setDate(expiredAt.getDate() + 7)

    await this.refreshTokenModel.updateOne(
      { userId },
      { $set: { expiredAt, token } },
      { upsert: true },
    )
  }
}
