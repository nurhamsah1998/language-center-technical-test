import {
  Controller,
  Get,
  Body,
  Put,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { AuthGuardService } from 'src/guard/guard.service';
import { ChangeMyPasswordDto, UpdateProfileDto } from './profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profile')
@UseGuards(AuthGuardService)
@ApiBearerAuth('access_token')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async MyProfile(@Req() request: Request) {
    try {
      return await this.profileService.MyProfile(request);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }

  @Put()
  async UpdateMyProfile(
    @Body() body: UpdateProfileDto,
    @Req() request: Request,
  ) {
    try {
      await this.profileService.UpdateMyProfile({ body, request });
      return { message: 'successfully update profile' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }

  @Put('/change-my-password')
  async ChangeMyPassword(
    @Body() body: ChangeMyPasswordDto,
    @Req() request: Request,
  ) {
    try {
      await this.profileService.ChangeMyPassword({ body, request });
      return { message: 'successfully change password!' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error?.message || 'Bad Request');
    }
  }
}
