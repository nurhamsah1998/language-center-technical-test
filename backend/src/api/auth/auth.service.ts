/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthResetDto,
} from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { UserSession } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async Register({ body }: { body: AuthRegisterDto }) {
    return await this.prisma.user.create({
      data: {
        email: body?.email,
        password: await bcrypt.hash(body.password, 10),
        role: 'Customer',
        profile: {
          create: {
            name: body.name,
            phoneNumber: body.phoneNumber,
          },
        },
      },
    });
  }

  async Login({ body }: { body: AuthLoginDto }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
      select: {
        email: true,
        id: true,
        profile: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
        password: true,
      },
    });
    const isWrongPassword = await bcrypt.compare(
      body.password,
      (user as unknown as User)?.password,
    );

    if (!isWrongPassword) {
      throw { message: `Invalid credential` };
    }
    const tokenPayload: UserSession = {
      email: user?.email,
      id: user?.id,
      phone_number: user?.profile?.phoneNumber,
      name: user?.profile?.name,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: '8h',
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: '7d',
    });
    const data = await this.prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        refreshToken: refreshToken,
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
    return { ...data, accessToken };
  }

  async ForgotPassword({ body }: { body: AuthForgotPasswordDto }) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: body.email,
      },
      select: {
        email: true,
        id: true,
      },
    });
    if (!user) {
      throw { message: `${body.email} not found in our database` };
    }
    const UserSession = {
      email: user?.email,
      id: user?.id,
    };
    const forgotPasswordToken = await this.jwtService.signAsync(UserSession, {
      secret: process.env.RESET_PASSWORD_TOKEN,
      expiresIn: '14d',
    });

    const data = await this.prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        forgotPasswordToken: forgotPasswordToken,
      },
      select: {
        forgotPasswordToken: true,
      },
    });
    return data;
  }

  async ResetPassword({
    body,
    forgotPasswordToken,
  }: {
    body: AuthResetDto;
    forgotPasswordToken: string;
  }) {
    /// VERIFY TOKEN
    const payload = await this.jwtService.verifyAsync(forgotPasswordToken, {
      secret: process.env.RESET_PASSWORD_TOKEN,
    });
    if (body.new_password !== body.retype_password) {
      throw { message: 'new password and retype password not match!' };
    }
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload['id'],
      },
      select: {
        email: true,
        id: true,
        profile: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
        forgotPasswordToken: true,
      },
    });
    if (!user) {
      throw { message: 'user not found' };
    }
    /// IF USER USING OLD FORGOT PASSWORD TOKEN TO RESET PASSWORD
    if (!user.forgotPasswordToken) {
      throw { message: 'cannot reset your password using old token!' };
    }
    await this.prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        password: await bcrypt.hash(body.new_password, 10),
        forgotPasswordToken: null,
      },
    });
  }
}
