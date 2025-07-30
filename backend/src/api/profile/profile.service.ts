import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { UserSession } from '../auth/types';
import { UpdateProfileDto } from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findOne(request: Request) {
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

  async update({
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
}
