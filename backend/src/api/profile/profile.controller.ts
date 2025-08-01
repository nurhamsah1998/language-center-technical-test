import { Controller, Get, Body, Put, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { AuthGuardService } from 'src/guard/guard.service';
import { UpdateProfileDto } from './profile.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profile')
@UseGuards(AuthGuardService)
@ApiBearerAuth('access_token')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findAll(@Req() request: Request) {
    return this.profileService.MyProfile(request);
  }

  @Put()
  update(@Body() body: UpdateProfileDto, @Req() request: Request) {
    return this.profileService.UpdateMyProfile({ body, request });
  }
}
