/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import {
  AuthForgotPasswordDto,
  AuthLoginDto,
  AuthRefreshTokenDto,
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
  private accessTokenExpiresIn = '20s';
  private refreshTokenExpiresIn = '7d';

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
        role: true,
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
      role: user?.role,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.REFRESH_TOKEN,
      expiresIn: this.refreshTokenExpiresIn,
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
        role: true,
        profile: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
    return { ...data, accessToken, refreshToken };
  }

  async RefreshToken({ body }: { body: AuthRefreshTokenDto }) {
    const user = await this.prisma.user.findFirst({
      where: {
        refreshToken: body.refreshToken,
      },
      select: {
        email: true,
        id: true,
        refreshToken: true,
        role: true,
        profile: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
    });
    if (!user) {
      throw {
        message: `refresh token has ended or not found, please login again!`,
      };
    }
    try {
      await this.jwtService.verifyAsync((user as any)?.refreshToken, {
        secret: process.env.REFRESH_TOKEN,
      });
    } catch {
      throw {
        message: `refresh token has ended, please login again!`,
      };
    }
    const tokenPayload: UserSession = {
      email: user?.email,
      id: user?.id,
      phone_number: user?.profile?.phoneNumber,
      name: user?.profile?.name,
      role: user.role,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      secret: process.env.ACCESS_TOKEN,
      expiresIn: this.accessTokenExpiresIn,
    });
    return accessToken;
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
    if (body.newPassword !== body.retypePassword) {
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
        password: await bcrypt.hash(body.newPassword, 10),
        forgotPasswordToken: null,
      },
    });
  }
}
