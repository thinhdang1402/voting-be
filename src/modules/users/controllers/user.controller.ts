import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from '../entities/users.entity'
import { Roles } from 'decorators/roles.decorator'
import { RoleType } from '../users.type'
import { UpdateUserDto } from '../dto/update-user.dto'
import { SignUpDto } from '../dto/sign-up.dto'

// @UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // @Roles(RoleType.Admin)
  @Get()
  async findAll() {
    return await this.userModel.find()
  }

  @Roles(RoleType.Admin)
  @Post('create-admin')
  async createAdmin(@Body() createAdminDto: SignUpDto) {
    return await this.userModel.create({
      role: RoleType.Admin,
      ...createAdminDto,
    })
  }

  @Roles(RoleType.Admin)
  @Delete('remove-admin/:id')
  async removeAdmin(@Param('id') id: string) {
    return await this.userModel.findByIdAndDelete(id)
  }

  @Roles(RoleType.Admin)
  @Patch('update-admin')
  async updateAdmin(
    @Body() updateAdminDto: UpdateUserDto,
    @Param('id') id: string,
  ) {
    return await this.userModel.findByIdAndUpdate(id, updateAdminDto, {
      new: true,
      upsert: true,
    })
  }
  @Get('/self')
  async findOne(@Req() req) {
    return await this.userModel.findById(req.userId)
  }

  @Patch()
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(req.userId, updateUserDto, {
      new: true,
      upsert: true,
    })
  }

  @Roles(RoleType.Admin)
  @Delete(':id')
  async remove(@Req() req) {
    return await this.userModel.findByIdAndDelete(req.userId)
  }
}
