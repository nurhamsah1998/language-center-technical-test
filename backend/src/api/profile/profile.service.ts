import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserSession } from '../auth/types';
import { ChangeMyPasswordDto, UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async MyProfile(request: Request) {
    const userSession: UserSession = request['user'];
    const data = await this.prisma.user.findFirst({
      where: {
        id: userSession.id,
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (!data) {
      throw { message: `user not found` };
    }
    return data;
  }

  async UpdateMyProfile({
    body,
    request,
  }: {
    body: UpdateProfileDto;
    request: Request;
  }) {
    const userSession: UserSession = request['user'];
    const data = await this.prisma.user.update({
      where: {
        id: userSession.id,
      },
      data: {
        profile: {
          update: {
            name: body.name,
            phoneNumber: body.phoneNumber,
          },
        },
      },

      select: {
        id: true,
        email: true,
        profile: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (!data) {
      throw { message: `user not found` };
    }
    return data;
  }

  async ChangeMyPassword({
    body,
    request,
  }: {
    body: ChangeMyPasswordDto;
    request: Request;
  }) {
    const userSession: UserSession = request['user'];
    const data = await this.prisma.user.findFirst({
      where: {
        id: userSession.id,
      },
      select: {
        password: true,
      },
    });
    if (!data) {
      throw { message: `user not found` };
    }
    const isWrongPassword = await bcrypt.compare(
      body.currentPassword,
      data.password,
    );

    if (!isWrongPassword) {
      throw { message: `Invalid current password` };
    }
    if (body.newPassword !== body.retypePassword) {
      throw { message: 'new password and retype password not match!' };
    }
    await this.prisma.user.update({
      where: {
        id: userSession.id,
      },
      data: {
        password: await bcrypt.hash(body.newPassword, 10),
      },
    });
  }
}
