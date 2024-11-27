import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as twilio from 'twilio'

import { EnvironmentVariables } from 'configs/configuration'
import { SchedulerRegistry } from '@nestjs/schedule'

@Injectable()
export class SmsService {
  private readonly accountSid: string
  private readonly authToken: string
  private readonly serviceId: string

  constructor(
    private readonly config: ConfigService<EnvironmentVariables>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.accountSid = this.config.get<string>('twilioSms.accountSid', {
      infer: true,
    })
    this.authToken = this.config.get<string>('twilioSms.authToken', {
      infer: true,
    })
    this.serviceId = this.config.get<string>('twilioSms.serviceId', {
      infer: true,
    })
  }

  private get client() {
    return twilio(this.accountSid, this.authToken)
  }

  async sendOtp(phoneNumber: string): Promise<any> {
    try {
      const verification = await this.client.verify.v2
        .services(this.serviceId)
        .verifications.create({
          to: `+84${phoneNumber}`,
          channel: 'sms',
        })

      this.schedulerRegistry.addTimeout(
        verification.sid,
        setTimeout(() => this.expiredCode(verification.sid), 90000),
      )
      return verification
    } catch (error) {
      throw new BadRequestException(`Failed to send OTP: ${error.message}`)
    }
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<any> {
    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.serviceId)
        .verificationChecks.create({ to: `+84${phoneNumber}`, code })

      this.schedulerRegistry.deleteTimeout(verificationCheck.sid)
      return verificationCheck
    } catch (error) {
      throw new BadRequestException(`Failed to verify OTP: ${error.message}`)
    }
  }

  async expiredCode(sid: string) {
    try {
      await this.client.verify.v2
        .services(this.serviceId)
        .verifications(sid)
        .update({
          status: 'canceled',
        })
    } catch (error) {
      throw new BadRequestException(`Failed to expired code: ${error.message}`)
    }
  }
}
